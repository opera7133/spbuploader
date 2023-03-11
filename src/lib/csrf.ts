import { nextCsrf } from "@opera7133/next-csrf";

const { csrf, setup } = nextCsrf({
  secret: process.env.NEXT_CSRF_SECRET,
});

export { csrf, setup };