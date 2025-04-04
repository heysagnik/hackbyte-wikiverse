import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        
        try {
          await connectToDatabase();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }
          
          if (!user.password) {
            console.error('Password field missing in user document');
            throw new Error('Invalid user account configuration');
          }
          
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!isMatch) {
            throw new Error('Invalid credentials');
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.displayName || user.username,
            username: user.username,
            level: user.level || 1,
            xp: user.xp || 0,
            contributions: user.contributions || 0
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.username = (user as any).username;
        token.level = (user as any).level;
        token.xp = (user as any).xp;
        token.contributions = (user as any).contributions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).username = token.username;
        (session.user as any).level = token.level;
        (session.user as any).xp = token.xp;
        (session.user as any).contributions = token.contributions;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };