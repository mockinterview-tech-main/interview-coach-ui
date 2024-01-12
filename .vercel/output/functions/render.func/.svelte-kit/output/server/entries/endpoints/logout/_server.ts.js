const GET = async ({ locals }) => {
  locals.pb?.authStore.clear();
  return new Response(null, { status: 303 });
};
export {
  GET
};
