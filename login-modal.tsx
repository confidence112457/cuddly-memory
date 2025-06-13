import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, register, loginPending, registerPending } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ username, password });
        toast({
          title: "Success",
          description: "Login successful!",
        });
      } else {
        await register({ username, email, password, firstName, lastName });
        toast({
          title: "Success",
          description: "Registration successful! You are now logged in.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
              <Card className="glassmorphism max-w-md w-full">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <i className="fas fa-chart-line text-2xl text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">
                      {isLogin ? "Welcome Back!" : "Join Genius Trading"}
                    </h2>
                    <p className="text-muted-foreground">
                      {isLogin ? "Please login to continue" : "Create your account to start investing"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <motion.div
                      className="w-full h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center">
                        <i className="fas fa-user-tie text-4xl text-green-500/50 mb-2" />
                        <p className="text-muted-foreground text-sm">Professional Trading</p>
                      </div>
                    </motion.div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="sr-only">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-muted border-border focus:border-green-500"
                        required
                      />
                    </div>
                    {!isLogin && (
                      <>
                        <div>
                          <Label htmlFor="email" className="sr-only">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-muted border-border focus:border-green-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="firstName" className="sr-only">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder="First Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="bg-muted border-border focus:border-green-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="sr-only">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              type="text"
                              placeholder="Last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="bg-muted border-border focus:border-green-500"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="password" className="sr-only">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-muted border-border focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Button variant="link" className="text-green-500 hover:underline p-0 h-auto">
                        Forgot password?
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg"
                      disabled={loginPending || registerPending}
                    >
                      {loginPending || registerPending ? "Please wait..." : (isLogin ? "Sign in" : "Create Account")}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                      <Button 
                        variant="link" 
                        className="text-green-500 hover:underline p-0 h-auto"
                        onClick={() => setIsLogin(!isLogin)}
                        type="button"
                      >
                        {isLogin ? "Sign Up" : "Sign In"}
                      </Button>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
