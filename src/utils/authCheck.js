import jwt from "@tsndr/cloudflare-worker-jwt";

const authCheck = async (request) => {
  const authorization = request.headers.get("authorization");
  try {
    if (!authorization) throw new Error("No authorization header found");
    const token = authorization.split(" ")[ 1 ];
    const isValid = await jwt.verify(token, SECRET);
    if (!isValid)
      throw new Error("Provided token is either expired or invalid.");

    const { payload: user } = jwt.decode(token);
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
