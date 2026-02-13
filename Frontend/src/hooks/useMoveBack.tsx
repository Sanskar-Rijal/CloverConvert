import { useNavigate } from "react-router";

export default function useMoveBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}
