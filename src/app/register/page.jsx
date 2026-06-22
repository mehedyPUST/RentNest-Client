"use client";
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
    Button,
    Card,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
    Popover,
    PopoverTrigger,
    PopoverContent,
    RadioGroup,
    Radio,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { MdEmail, MdLock, MdPerson, MdImage, MdHome, MdBusiness } from "react-icons/md";

export default function SignUpPage() {

    // const uploadImage = async (imageFile)=> {
    //     const formData = new FormData()
    //     formData.append('image,imageFile')
    // }


    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("tenant");
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const roles = [
        { id: "tenant", label: "Tenant", description: "Looking for a home", icon: MdHome, colorClass: "text-blue-600", bgClass: "bg-blue-100" },
        { id: "owner", label: "Owner", description: "List your property", icon: MdBusiness, colorClass: "text-purple-600", bgClass: "bg-purple-100" },
    ];

    const getSelectedRoleLabel = () => {
        const role = roles.find(r => r.id === selectedRole);
        return role ? role.label : "Select your role";
    };

    const getSelectedRoleIcon = () => {
        const role = roles.find(r => r.id === selectedRole);
        if (!role) return null;
        const Icon = role.icon;
        return <Icon className={selectedRole === "tenant" ? "text-blue-500" : "text-purple-500"} size={18} />;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const formData = new FormData(e.target);
        const formEntries = Object.fromEntries(formData.entries());

        const name = formEntries.name;
        const image = formEntries.image;
        const email = formEntries.email;
        const password = formEntries.password;
        const role = selectedRole;

        if (!name || !email || !password || !role) {
            toast.error("Please fill in all required fields");
            setIsLoading(false);
            return;
        }

        const loadingToast = toast.loading("Creating your account...");

        try {
            const result = await authClient.signUp.email({
                name,
                email,
                password,
                image: image || undefined,
                role: role,
            });

            if (result.error) {
                toast.dismiss(loadingToast);

                if (result.error.message?.includes("already")) {
                    toast.error("This email is already registered. Try signing in instead.");
                } else if (result.error.message?.includes("blocked")) {
                    toast.error("This account has been blocked. Please contact support.");
                } else {
                    toast.error(result.error.message || "Signup failed. Please check your details.");
                }
                setIsLoading(false);
                return;
            }

            toast.dismiss(loadingToast);
            toast.success(`🎉 Account created successfully as ${role}!`);

            setTimeout(() => {
                router.push("/dashboard");
            }, 1200);

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const loadingToast = toast.loading("Redirecting to Google...");

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });

            toast.dismiss(loadingToast);
            toast.success("🎉 Signed in with Google as Tenant!");

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Google sign-in failed. Try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <span>📝</span>
                        <span>Join Us Today</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">
                        Create Account
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-500 mx-auto rounded-full"></div>
                    <p className="text-gray-500 mt-4">
                        Sign up for exclusive deals and offers
                    </p>
                </div>

                {/* Sign Up Card */}
                <div className="flex justify-center items-center">
                    <Card className="w-full max-w-md border border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                        <div className="p-6 md:p-8">
                            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
                                {/* Name Field */}
                                <TextField isRequired name="name" type="text">
                                    <Label className="text-gray-700 font-semibold">Full Name</Label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            placeholder="Enter your name"
                                            className="pl-10 border-amber-100 focus:border-amber-400 w-full"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <FieldError />
                                </TextField>

                                {/* Image URL Field */}
                                <TextField name="image" type="text">
                                    <Label className="text-gray-700 font-semibold">Profile Image URL (Optional)</Label>
                                    <div className="relative">
                                        <MdImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            placeholder="https://example.com/avatar.jpg"
                                            className="pl-10 border-amber-100 focus:border-amber-400 w-full"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <FieldError />
                                </TextField>

                                {/* Email Field */}
                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    validate={(value) => {
                                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                            return "Please enter a valid email address";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className="text-gray-700 font-semibold">Email</Label>
                                    <div className="relative">
                                        <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            placeholder="john@example.com"
                                            className="pl-10 border-amber-100 focus:border-amber-400 w-full"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <FieldError />
                                </TextField>

                                {/* Password Field */}
                                <TextField
                                    isRequired
                                    minLength={8}
                                    name="password"
                                    type="password"
                                    validate={(value) => {
                                        if (value.length < 8) {
                                            return "Password must be at least 8 characters";
                                        }
                                        if (!/[A-Z]/.test(value)) {
                                            return "Password must contain at least one uppercase letter";
                                        }
                                        if (!/[0-9]/.test(value)) {
                                            return "Password must contain at least one number";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className="text-gray-700 font-semibold">Password</Label>
                                    <div className="relative">
                                        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            placeholder="Enter your password"
                                            className="pl-10 border-amber-100 focus:border-amber-400 w-full"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Description className="text-gray-400">
                                        Must be at least 8 characters with 1 uppercase and 1 number
                                    </Description>
                                    <FieldError />
                                </TextField>

                                {/* Role Selection */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-gray-700 font-semibold">I want to join as a</Label>

                                    <Popover isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen} placement="bottom" className="w-[340px] md:w-[380px]">
                                        <PopoverTrigger>
                                            <Button
                                                aria-label="Select role dropdown trigger"
                                                variant="bordered"
                                                className="w-full justify-between border-2 border-amber-200 bg-white hover:bg-amber-50 text-gray-700 font-medium h-12 rounded-xl text-left px-4"
                                                endContent={<span className="text-gray-400 text-xs">▼</span>}
                                                startContent={getSelectedRoleIcon()}
                                                disabled={isLoading}
                                            >
                                                {getSelectedRoleLabel()}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-3 bg-white border border-gray-100 shadow-xl rounded-xl">
                                            <RadioGroup
                                                aria-label="Select your signup role"
                                                value={selectedRole}
                                                onValueChange={(value) => {
                                                    setSelectedRole(value);
                                                    setTimeout(() => setIsDropdownOpen(false), 200);
                                                }}
                                                className="gap-2.5 w-full"
                                            >
                                                {roles.map((role) => {
                                                    const Icon = role.icon;
                                                    const isSelected = selectedRole === role.id;
                                                    return (
                                                        <Radio
                                                            key={role.id}
                                                            value={role.id}
                                                            aria-label={role.label} // FIX 1: স্ক্রিন রিডারের জন্য স্পষ্ট লেবেল যুক্ত করা হলো
                                                            className={`w-full max-w-full m-0 p-3 border rounded-xl transition-all cursor-pointer flex items-start gap-3
                                                                ${isSelected
                                                                    ? "border-amber-500 bg-amber-50/50 shadow-sm"
                                                                    : "border-gray-200 bg-white hover:border-amber-200"
                                                                }`}
                                                        >
                                                            {/* FIX 2: onClick এবং pointer-events হ্যান্ডেল করে ১০০% ক্লিকেবল করা হলো */}
                                                            <div
                                                                onClick={() => {
                                                                    setSelectedRole(role.id);
                                                                    setTimeout(() => setIsDropdownOpen(false), 200);
                                                                }}
                                                                className="flex items-center gap-3 w-full cursor-pointer select-none"
                                                            >
                                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${role.bgClass} ${role.colorClass}`}>
                                                                    <Icon size={18} />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="font-semibold text-gray-800 text-sm leading-tight">{role.label}</span>
                                                                    <span className="text-xs text-gray-400 mt-1 whitespace-normal leading-normal">{role.description}</span>
                                                                </div>
                                                            </div>
                                                        </Radio>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </PopoverContent>
                                    </Popover>

                                    <Description className="text-gray-400">
                                        Select your role to get started with the right features
                                    </Description>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold hover:from-amber-700 hover:to-orange-600 transition-all hover:scale-105 shadow-md h-12"
                                        disabled={isLoading}
                                    >
                                        <Check size={18} />
                                        {isLoading ? "Creating..." : "Create Account"}
                                    </Button>
                                    <Button
                                        type="reset"
                                        variant="flat"
                                        className="border border-amber-200 text-gray-600 hover:bg-amber-50 h-12"
                                        disabled={isLoading}
                                        onClick={() => setSelectedRole("tenant")}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </Form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-amber-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In Button */}
                            <div className="space-y-2">
                                <Button
                                    onClick={handleGoogleSignIn}
                                    className="w-full border-2 border-amber-200 bg-white text-gray-700 font-semibold hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 h-12"
                                    disabled={isLoading}
                                >
                                    <GrGoogle className="text-red-500" />
                                    {isLoading ? "Loading..." : "Sign Up with Google"}
                                </Button>
                                <p className="text-xs text-gray-400 text-center">
                                    ⚡ Google sign-up will automatically set your role as <span className="font-semibold text-blue-600">Tenant</span>
                                </p>
                            </div>

                            {/* Sign In Link */}
                            <p className="text-center text-sm text-gray-600 mt-6">
                                Already have an account?{' '}
                                <Link href="/login" className="text-amber-600 font-semibold hover:text-amber-700 hover:underline transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}