import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const LOGIN_API_URL = "http://localhost:5000/api/login";

const Input: React.FC<any> = ({ className = '', ...props }) => (
    <input
        className={`w-full p-3 rounded-xl border border-gray-300 
        bg-white/80 backdrop-blur-sm shadow-sm
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        transition-all duration-200 ${className}`}
        {...props}
    />
);

const Button: React.FC<any> = ({ children, className = '', disabled, ...props }) => (
    <button
        className={`
        w-full py-3 rounded-xl font-semibold text-white text-lg
        bg-gradient-to-r from-indigo-600 to-violet-600
        hover:from-indigo-700 hover:to-violet-700
        shadow-md hover:shadow-xl
        transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
        `}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

const Login = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        // Load animation data from public folder
        const loadAnimation = async () => {
            try {
                const response = await fetch("/login.json");
                if (response.ok) {
                    const data = await response.json();
                    setAnimationData(data);
                } else {
                    console.error("Failed to fetch animation:", response.statusText);
                }
            } catch (err) {
                console.error("Failed to load Lottie animation:", err);
            }
        };
        loadAnimation();
    }, []);

    // Back to dashboards page
    const goBack = () => {
        navigate("/home");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!phone || !password) {
            setError("Please enter both phone number and password.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: phone, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("user_id", data.userId);
                navigate("/calendar");
            } else {
                setError(data.message || "Invalid credentials.");
                setPassword("");
            }
        } catch (err) {
            console.error("Login Fetch Error:", err);
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-violet-200 to-indigo-300 
        flex flex-col p-4 select-none">

            {/* 🔙 Back Button fixed to page top-left */}
            <button
                onClick={goBack}
                className="bg-white/80 backdrop-blur-md text-gray-900 font-semibold px-4 py-2 
                rounded-full shadow-md hover:bg-white hover:shadow-lg transition duration-200 self-start"
            >
                ← Back
            </button>

            {/* Center login card vertically and horizontally */}
            <div className="flex-1 flex items-center justify-center mt-4">
                <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/30 
                 bg-white/40 backdrop-blur-xl relative">

                    {/* Lottie Animation */}
                    {animationData && (
                        <div className="w-52 h-52 mx-auto -mt-4 mb-2 drop-shadow-xl">
                            <Lottie animationData={animationData} loop={true} />
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-gray-700 mt-1">Sign in to continue your journey</p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 shadow">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">Phone Number</label>
                            <Input
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter your phone number"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">Password</label>
                            <Input
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter password"
                                disabled={loading}
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Sign In"}
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;
