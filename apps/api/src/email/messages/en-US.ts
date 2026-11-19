// Email texts in English (US). Keep the same keys as pt-BR.ts.
export default {
  verify: {
    subject: "Confirm your email on GoToUSA",
    greeting: "Hi, {name}!",
    intro: "Just one more step to activate your GoToUSA account. Tap the link below to confirm your email:",
    action: "Confirm my email",
    expiry: "The link is valid for {hours} hour(s).",
    ignore: "If you didn't create a GoToUSA account, you can ignore this email.",
  },
  reset: {
    subject: "Create a new password on GoToUSA",
    greeting: "Hi, {name}!",
    intro: "We received a request to create a new password for your account. Tap the link below to choose your new password:",
    action: "Create new password",
    expiry: "The link is valid for {hours} hour(s). When you change your password, your other open sessions are signed out.",
    ignore: "If you didn't ask for this, you can ignore this email: your password stays the same.",
  },
  invite: {
    subject: "{inviter} invited you to a journey on GoToUSA",
    greeting: "Hi, {name}!",
    greetingNoName: "Hi!",
    intro: "{inviter} invited you to the journey “{journey}” on GoToUSA, so you can follow the preparation for the move to the United States together. Tap the link below to see the invitation:",
    action: "See the invitation",
    expiry: "The invitation is valid for {days} days.",
    ignore: "If you weren't expecting this invitation, you can ignore this email.",
  },
  footer: "GoToUSA: your companion on the journey to living in the United States.",
};
