import * as config from "@/server/config";
import { User } from "@/server/models/userModel";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { UserRoleType } from "@/types/server/user";

const opts = {
  // Prepare the extractor from the header.
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies["authorization"],
    ExtractJwt.fromUrlQueryParameter("access_token"),
    ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  ]),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  // Use the secret passed in which is loaded from the environment. This can be
  // a certificate (loaded) or a HMAC key.
  secretOrKey: config.JWT_KEY,
  // Verify the issuer.
  issuer: config.JWT_ISSUER,
  // Verify the audience.
  audience: config.JWT_AUDIENCE,
  // Enable only the HS256 algorithm.
  algorithms: [config.JWT_ALG],
  // Pass the request object back to the callback so we can attach the JWT to it.
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async function (req, jwt_payload, done) {
    try {
      const userInfo = await User.findOne({
        id: jwt_payload.id,
      });
      if (userInfo && userInfo.role !== UserRoleType.LOCKED) {
        done(null, userInfo);
      } else {
        done(null, false);
      }
    } catch (e) {
      return done(e);
    }
  })
);

export default passport;
