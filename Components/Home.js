import { useAuthStore } from "@/Store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const handleClick = () => {
    router.push("/Login");
  };
  useEffect(() => {
    if (!isAuthenticated) {
      useRouter.push("Login");
      return;
    }

    if (user.role.name == "Admin") {
      useRouter.push("/Dashboard");
    } else {
      useRouter.push("/Merchant/Dashboard");
    }
  }, []);
}
