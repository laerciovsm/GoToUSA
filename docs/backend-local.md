# Backend local (fase de testes com a família)

> Decisão do fundador em 19/11/2026: montar backend, banco de dados, contas e e-mail **tudo no PC do fundador**, sem publicar nada na web, para testar com a família **na mesma rede Wi-Fi**. **Só HTTP durante esta fase** (decisão do fundador). Documentado antes de implementar.

## Objetivo

Validar com a família o **acesso compartilhado** ([acesso-compartilhado.md](acesso-compartilhado.md)): o responsável cria a conta, convida as pessoas por e-mail, cada uma entra no próprio celular, vê a jornada, faz a sua parte e atualiza o app.

- **O modo gratuito sem conta continua funcionando** como hoje (tudo no navegador). A conta é uma opção a mais.
- Nada fica acessível pela internet: só pela rede de casa.

## Visão geral

```
Celulares da família (mesmo Wi-Fi)
        │  http://192.168.0.6:3000
        ▼
┌──────────────────── PC do fundador ────────────────────┐
│  App web (Next.js) :3000  ── /api/* ──►  API (NestJS) :4000 │
│                                              │          │
│                         PostgreSQL :5432 ◄───┤          │
│                         Mailpit :1025/:8025 ◄┤ (testes) │
│                         Gmail (SMTP) ◄───────┘ (família)│
└────────────────────────────────────────────────────────┘
```

- **Uma única porta aberta na rede: 3000** (o app). O app repassa `/api/*` para a API (recurso *rewrites* do Next.js). Assim, para o navegador, app e API são o mesmo endereço: **sem CORS** e o cookie de sessão fica só nesse endereço.
- **API, banco e Mailpit escutam só no próprio PC** (`127.0.0.1`), nunca na rede.
- O **PC precisa estar ligado** para a família usar.

## Componentes

| Peça | Ferramenta | Licença | Observação |
|---|---|---|---|
| API | NestJS (já na stack) | MIT | `apps/api` (hoje só tem o README) |
| Banco | PostgreSQL (imagem oficial) | PostgreSQL | Pelo Docker Compose |
| Acesso ao banco | Prisma (já na stack) | Apache 2.0 | Migrações versionadas no Git |
| Autenticação | **Better Auth** | MIT | Ver abaixo |
| Hash de senha | **Argon2id** (exigência do CLAUDE.md) | — | Better Auth usa scrypt por padrão; trocamos pelo Argon2id com as opções `password.hash` e `password.verify` |
| E-mail | **Nodemailer** | MIT No Attribution | Envio por SMTP |
| E-mail de teste | **Mailpit** | MIT | Captura os e-mails sem enviar; tela em `http://localhost:8025` |
| E-mail real (família) | **Gmail** com **senha de app** | — | Ver abaixo |
| Validação | Zod de `packages/shared` | MIT | O mesmo código do navegador |
| Cache (Valkey) | **Fica de fora nesta fase** | — | Sessões e limites de tentativas cabem no PostgreSQL. Entra quando for necessário |

### Por que Better Auth

- Biblioteca de autenticação **pronta e testada** (premissa: nunca escrever autenticação do zero), MIT, muito usada (cerca de 30 mil estrelas no GitHub em 19/11/2026).
- Já traz o que o desenho do acesso compartilhado precisa:
  - **e-mail e senha** com **confirmação de e-mail** (`requireEmailVerification`) e **recuperação de senha**;
  - senha de **8 a 128 caracteres** por padrão;
  - **plugin de organização**: cada **jornada é uma organização**, com os papéis **owner, admin e member**, que são os nossos **dono, admin e participante**;
  - **convites por e-mail** com validade (padrão de 48 horas, configurável em `invitationExpiresIn`; vamos usar 7 dias);
  - **controle de acesso** com permissões próprias (`createAccessControl`);
  - **2FA** por plugin (fica para antes da publicação).
- Fontes: documentação oficial do Better Auth (plugin de organização e e-mail e senha) e o repositório no GitHub, conferidos em 19/11/2026.
- **Integração com o NestJS:** o pacote de NestJS para Better Auth é **mantido pela comunidade**, não pelo Better Auth. Para não depender dele, a proposta é **montar o manipulador oficial do Better Auth** (para Node/Express) dentro do NestJS e escrever um **guarda** pequeno que pergunta ao Better Auth quem é a sessão. A decisão final fica para o passo 3, depois de testar.

### E-mail: Mailpit nos testes, Gmail para a família

- **Mailpit** (desenvolvimento): todos os e-mails ficam presos numa tela local. Ninguém recebe nada de verdade e a cota do Gmail não é gasta.
- **Gmail** (teste com a família): envio por SMTP com uma **senha de app** do Google. Regras do Google (página de ajuda "Fazer login com senhas de app", conferida em 19/11/2026):
  - exige a **verificação em 2 etapas** ligada;
  - não aparece em contas de trabalho ou escola, com Proteção Avançada ou com 2 etapas só por chave de segurança;
  - **trocar a senha da conta Google revoga todas as senhas de app**;
  - o próprio Google diz que senha de app "não é recomendada". Serve para o teste local; para publicar, usar um serviço de e-mail próprio.
- **Recomendação:** criar um **Gmail novo só para o GoToUSA**, em vez de usar o pessoal.
- A senha de app fica **só no `.env`**, que nunca vai para o Git.
- **Alternativa sem e-mail:** a tela de convite terá o botão **"Copiar link do convite"**, para mandar pelo WhatsApp se o e-mail cair no spam.

## Banco de dados: o que fica guardado

**Tabelas do Better Auth** (criadas por ele, com migração do Prisma):
- `user` (nome, e-mail, e-mail confirmado), `account` (senha com hash Argon2id), `session`, `verification` (códigos de confirmação);
- `organization` (= **jornada**), `member` (pessoa ↔ jornada ↔ papel), `invitation` (convites).

**Tabelas do GoToUSA:**
- `journey_data`: para cada jornada, o **questionário** e o **progresso** (JSON validado pelos mesmos Zod do navegador e com as mesmas migrações de formato), mais um **número de versão** para evitar que duas pessoas salvando ao mesmo tempo apaguem o trabalho uma da outra.
- `member_person`: liga a conta à **pessoa da família** no questionário (ex.: "Cônjuge", "Filho 1"), para cada um ver as suas tarefas.
- `activity`: histórico ("Cônjuge concluiu Conferir o passaporte").

**O que nunca vai para o banco:** documentos, números de documentos, senhas em texto (só o hash), dados de cartão.

## Quem pode fazer o quê (aplicado na API)

As permissões de [acesso-compartilhado.md](acesso-compartilhado.md#papéis-de-acesso-fase-do-backend) são conferidas **na API**, nunca só na tela:

- **Participante:** recebe a jornada **sem** as respostas de saúde e de dinheiro dos outros. Só pode alterar o progresso das tarefas que executa.
- **Admin e dono:** tudo. Só o dono apaga ou transfere a jornada.
- Toda entrada passa pelo Zod. Toda alteração confere o papel e a versão.

## Fluxos

**1. Criar a conta do responsável**
- Nesta fase, **cadastro aberto só para e-mails autorizados** (lista no `.env`, ex.: o e-mail do fundador). O resto entra só por convite.
- Cadastro com nome, e-mail e senha → e-mail de confirmação → login.
- **Levar a jornada para a conta:** depois do login, o app oferece copiar a jornada salva no navegador para a conta (mesma validação do importar). A cópia do navegador só é apagada se a pessoa quiser.

**2. Convidar uma pessoa**
- O dono ou o admin escolhe a pessoa da família (ex.: "Cônjuge"), informa nome e e-mail e escolhe o papel (admin ou participante).
- O app envia o e-mail com o link (válido por 7 dias) e mostra "Copiar link do convite".
- Crianças e adultos que não podem executar tarefas não aparecem na lista de quem pode ser convidado.

**3. Aceitar o convite**
- A pessoa abre o link, cria a **própria senha**, aceita o **aviso legal** e o uso dos dados dela, e entra na jornada.
- O Better Auth exige uma sessão com o mesmo e-mail do convite para aceitar. A confirmação do e-mail pelo próprio link do convite será definida no passo 4.

**4. Usar no dia a dia**
- Cada pessoa vê a jornada conforme o papel. O filtro por pessoa já abre nas tarefas dela.
- Cada salvamento leva o número da versão. Se outra pessoa salvou antes, o app recarrega a versão nova e reaplica a mudança, sem perder o que foi digitado.

## Segurança nesta fase

**O que vale desde já:**
- Senha com **Argon2id**; o admin nunca vê nem escolhe a senha de ninguém.
- Convites de **uso único**, com validade, que o admin pode cancelar ou reenviar.
- **Limite de tentativas** de login e de envio de convites.
- Mensagens que **não revelam se um e-mail tem conta**.
- Cookies de sessão **HttpOnly** e **SameSite**.
- **Segredos só no `.env`** (senha do banco, segredo do Better Auth, senha de app do Gmail). O `.env.example` traz só os nomes.
- **Firewall do Windows:** liberar a porta 3000 **só para rede privada**. Banco, API e Mailpit escutam só em `127.0.0.1`.
- **Dados da família no PC:** ligar a **criptografia do disco** do Windows e fazer **backup do banco** (comando `pg_dump`, com script pronto).

**Riscos aceitos só nesta fase (decisão do fundador):**
- **HTTP sem criptografia:** a senha e os dados passam abertos pelo Wi-Fi de casa. Por isso o cookie não usa a marca `Secure`, que só funciona em HTTPS. Risco baixo numa rede doméstica com senha forte e só com a família.
- **Dados sensíveis sem criptografia por campo no banco:** a proteção é a criptografia do disco e o banco fechado no PC.
- **Sem 2FA** por enquanto.

**Antes de qualquer publicação (obrigatório):** HTTPS, cookie `Secure`, criptografia dos dados sensíveis no banco, 2FA, serviço de e-mail próprio no lugar do Gmail, cabeçalhos de segurança, verificações automáticas (Dependabot, Gitleaks) e a revisão da seção Segurança do [CLAUDE.md](../CLAUDE.md#segurança).

## O que precisa ser instalado no PC

- **Docker** para rodar o PostgreSQL e o Mailpit, com um `docker-compose.yml` no repositório. Opções: **Docker Desktop** (gratuito para uso pessoal e empresas pequenas) ou **Rancher Desktop** (totalmente gratuito). Os dois precisam do **WSL 2** do Windows, que **ainda não está instalado** (a virtualização do PC já está ligada).
- **Alternativa sem Docker:** instalar o PostgreSQL direto no Windows e o Mailpit como programa. Funciona, mas a configuração fica fora do repositório e é mais difícil de repetir.
- **Recomendação:** Docker Desktop. É o que a stack já previa, e subir e desligar tudo fica num só comando.

## Hospedagem na web, depois

O mesmo projeto em contêineres roda na web com o **Docker Engine** (Linux, gratuito); o Docker Desktop é só a ferramenta do Windows. Serviços que funcionam:
- **VPS** (servidor virtual) com **acesso root por SSH**, de preferência com virtualização **KVM** (OpenVZ ou LXC às vezes não rodam Docker);
- **plataforma de contêineres** que publica a partir de um `Dockerfile`, de preferência com **PostgreSQL gerenciado** (backup automático).

**Não serve:** hospedagem de sites compartilhada (cPanel, WordPress). Antes de contratar: procurar "Docker", "Dockerfile" ou "container" na documentação, perguntar ao suporte, conferir os termos e onde ficam os dados (LGPD). A comparação será feita nas fontes oficiais de cada serviço e documentada antes da contratação.

## Implementação em passos

Cada passo é testado, documentado e enviado ao GitHub antes do próximo.

1. **Banco e e-mail de teste:** WSL 2 e Docker instalados; `docker-compose.yml` com PostgreSQL e Mailpit (só em `127.0.0.1`); `.env.example` atualizado. *Pronto quando:* `pnpm db:up` sobe tudo e a tela do Mailpit abre.
2. **API vazia:** NestJS em `apps/api` com Prisma, rota de saúde (`/api/health`) e o *rewrite* do app. *Pronto quando:* o celular abre `http://<IP>:3000/api/health`.
3. **Contas e login:** Better Auth com Argon2id, cadastro só para e-mails autorizados, confirmação de e-mail (Mailpit), login, sair, recuperar senha. Telas de entrar e criar conta nos 3 idiomas. *Pronto quando:* o fundador cria a conta e entra pelo celular.
4. **Convites:** jornada como organização, convite com escolha da pessoa e do papel, e-mail com link, "Copiar link", aceitar o convite. Gmail configurado. *Pronto quando:* o cônjuge recebe o convite no e-mail e entra.
5. **Jornada no servidor:** levar a jornada do navegador para a conta; carregar e salvar pela API (o repositório de armazenamento troca o IndexedDB pela API quando há sessão); versão contra salvamentos simultâneos; histórico. *Pronto quando:* o que um conclui aparece no celular do outro.
6. **Permissões:** participante sem saúde e dinheiro dos outros, alterando só as tarefas que executa; testes automáticos de cada regra. *Pronto quando:* os testes de permissão passam e o fundador confere com a família.

## Pendências desta fase

- Definir no passo 3 se o NestJS usa o manipulador oficial do Better Auth (proposta) ou o pacote da comunidade.
- Definir no passo 4 como o link do convite também confirma o e-mail.
- Script de backup do banco e como restaurar.
