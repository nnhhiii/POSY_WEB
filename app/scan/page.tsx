"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/services/api.service";
import { useSnackbar } from "@/components/SnackbarContext";

export default function ScanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  useEffect(() => {
    const initSession = async () => {
      if (!tableId || !token) {
        showMessage("QR không hợp lệ", "error");
        router.replace("/");
        return;
      }

      try {
        await apiService.startSession(tableId, token);
        showMessage("Quét QR thành công!", "success");

        // redirect về home
        router.replace("/");
      } catch (err: any) {
        console.error(err);
        showMessage("Không thể tạo session", "error");
        router.replace("/");
      }
    };

    initSession();
  }, [tableId, token]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-4"></div>
      <p className="text-sm text-gray-500">Đang xử lý QR...</p>
    </div>
  );
}