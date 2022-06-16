import jwt from "@tsndr/cloudflare-worker-jwt";
import pgClient from "./pgClient";

const authCheck = async (request) => {
  const authorization = request.headers.get("authorization");
  try {
    if (!authorization) throw new Error("No authorization header found");
    const token = authorization.split(" ")[1];
    const isValid = await jwt.verify(token, `cgqlJWT`);
    if (!isValid)
      throw new Error("Provided token is either expired or invalid.");

    const { payload } = jwt.decode(token);
    const { data: user, error } = await pgClient
      .from("users")
      .select("*")
      .eq("id", payload.id)
      .single();

    if (error) throw new Error("No authorized user found");

    return {
      user,
    };
  } catch (error) {
    return {
      authError: error.message,
    };
  }
};

export default authCheck;
