import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {jwtVerify, SignJWT} from "jose";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },
            authorize: async (credentials) => {
                let user = null
                let user_data = {}

                // TODO: Replace with your authentication logic
                if (credentials.email === 'test@gmail.com' && credentials.password === 'P@ssword#123') {
                    user = {id: 1, name: 'John Doe', email: 'test@gmail.com', data: user_data};
                }

                // // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)
                //
                // // logic to verify if the user exists
                // user = await getUserFromDb(credentials.email, pwHash)
                //
                if (!user) {
                    // No user found, so this is their first attempt to login
                }

                // return the user object with their profile data
                return user
            },
        }),
    ],
    session: {strategy: "jwt", maxAge: 2 * 60 * 60},
    jwt: {
        // Manually set up our own JWT because Auth will automatically encrypt the JWT and this result in
        // the backend flask being unable to decrypt the JWT token and verify the user.
        encode: async ({token, secret, maxAge}) => {
            const iat = Math.floor(Date.now() / 1000);
            const exp = iat + (maxAge || 60 * 60); // Default to 1 hour if maxAge is not provided

            let encodedToken = new SignJWT({...token})
                .setProtectedHeader({alg: 'HS512'})
                .setIssuedAt(iat)
                .setExpirationTime(exp)
                .sign(new TextEncoder().encode(secret.toString()));

            // console.log("encodedToken", encodedToken);
            return encodedToken;
        },
        decode: async ({token, secret}) => {
            try {
                const {payload} = await jwtVerify(token, new TextEncoder().encode(secret.toString()), {
                    algorithms: ['HS512'],
                });
                // console.log("payload", payload);
                return payload;
            } catch (error) {
                // console.error('Failed to decode JWT:', error);
                return null;
            }
        }
    },
    callbacks: {
        session({session, token, user, trigger}) {
            session.user.id = token.id as string

            return session;
        },
        jwt({token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;

        },
        authorized: async ({auth}) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    trustHost: true,
});
