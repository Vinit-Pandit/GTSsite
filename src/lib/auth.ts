import jwt, {SignOptions} from "jsonwebtoken";

/**
 * Extract a token from a Cookie header string.
 * Checks common cookie names and returns the first match or null.
 */
export function parseTokenFromCookie(cookieHeader: string): string | null {
	// cookieHeader example: "a=1; token=abc; other=zzz"
	if (!cookieHeader) return null;
	const cookies = cookieHeader.split(";").map((c) => c.trim());
	const namesToCheck = ["token", "accessToken", "access_token", "authToken", "auth", "jwt"];
	for (const name of namesToCheck) {
		const match = cookies.find((c) => c.startsWith(`${name}=`));
		if (match) {
			return decodeURIComponent(match.split("=").slice(1).join("="));
		}
	}
	return null;
}

/**
 * Verify a JWT using the JWT secret from environment.
 * Returns the decoded payload on success, or null on failure.
 */
export function verifyToken(token: string): any | null {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		// Secret missing — treat as verification failure
		return null;
	}
	try {
		// jwt.verify throws on invalid/expired tokens
		const payload = jwt.verify(token, secret);
		return payload;
	} catch (err) {
		return null;
	}
}

/**
 * Sign a payload into a JWT using the JWT secret from environment.
 */
export function signToken(
    payload: string | object | Buffer,
    expiresIn: SignOptions["expiresIn"] = "7d"
  ): string {
    const secret = process.env.JWT_SECRET;
  
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
  
    return jwt.sign(payload, secret, { expiresIn });
  }
  