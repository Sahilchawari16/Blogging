"use client";

import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"; 

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
  return (
  <div className="h-[93.5vh] w-screen flex items-center justify-center bg-gray-100 overflow-x-hidden ">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          {/* Main Login Button */}
          <Button className="w-[75%] text-sm py-2">Login</Button>

          {/* Google Login Button */}
          <Button
            variant="outline"
            className="w-[75%] flex items-center justify-center gap-2 text-sm py-2"
            onClick={() => console.log("Google login logic here")}
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
