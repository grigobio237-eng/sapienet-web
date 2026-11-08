'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, Check, UploadCloud, Smile } from 'lucide-react';

interface ProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (webpDataUrl: string) => void;
  accentColor?: string; // 'purple' | 'red' | 'amber'
  title?: string;
  defaultCharacterPresets?: string[];
}

export default function ProfileImageUploader({
  currentImageUrl,
  onImageChange,
  accentColor = 'purple',
  title = '프로필 노출 이미지 (사진/캐릭터)',
  defaultCharacterPresets = ['🧑‍🍳', '🥩', '🐮', '🐷', '🚚', '👑', '⭐', '🔥'],
}: ProfileImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  // 브라우저 캔버스를 이용한 고해상도 리사이징 및 WebP 네이티브 변환 (모바일 OOM 방지)
  const handleProcessFileToWebp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const origBytes = file.size;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600; // 프로필 이미지용 최적 해상도
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const webpDataUrl = canvas.toDataURL('image/webp', 0.85);
          const webpApproxBytes = Math.round((webpDataUrl.length * 3) / 4);

          setPreviewUrl(webpDataUrl);
          setCompressionInfo(`WebP 최적화 (${(origBytes / 1024).toFixed(0)}KB ➔ ${(webpApproxBytes / 1024).toFixed(0)}KB)`);
          onImageChange(webpDataUrl);
          setIsProcessing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 프리셋 캐릭터 선택 시 캔버스에서 WebP 이미지로 생성하여 통일 저장
  const handleSelectCharacterPreset = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 배경 그라데이션
      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      if (accentColor === 'red') {
        grad.addColorStop(0, '#7f1d1d');
        grad.addColorStop(1, '#991b1b');
      } else if (accentColor === 'amber') {
        grad.addColorStop(0, '#78350f');
        grad.addColorStop(1, '#92400e');
      } else {
        grad.addColorStop(0, '#3b0764');
        grad.addColorStop(1, '#581c87');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      // 이모지 렌더링
      ctx.font = '150px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 150, 160);

      const webpUrl = canvas.toDataURL('image/webp', 0.9);
      setPreviewUrl(webpUrl);
      setCompressionInfo(`캐릭터 WebP 프로필 적용됨 (${emoji})`);
      onImageChange(webpUrl);
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/90 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <Camera size={16} className="text-purple-700" />
            {title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            스마트폰 카메라 촬영, 컴퓨터 파일(JPG/PNG) 또는 캐릭터를 선택하면 <strong>WebP 형식으로 자동 최적화</strong>되어 저장됩니다.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* 프로필 이미지 원형 미리보기 */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-purple-600 bg-slate-900 shadow-md flex items-center justify-center relative">
            {previewUrl ? (
              <img src={previewUrl} alt="프로필 노출 이미지" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-400">
                <Smile size={32} className="mx-auto mb-1 opacity-60" />
                <span className="text-[10px] block">미설정</span>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <RefreshCw size={20} className="animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white shadow-xs">
            WebP
          </span>
        </div>

        {/* 업로드 액션 & 캐릭터 프리셋 */}
        <div className="space-y-3 flex-1 w-full text-xs">
          {/* 모바일 카메라 / 파일 업로드 버튼 */}
          <div className="flex flex-wrap gap-2">
            <label className="flex-1 min-w-[140px] cursor-pointer">
              <div className="py-2.5 px-3 rounded-2xl bg-white border border-slate-300 hover:border-purple-600 font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs hover:bg-slate-50 transition-all text-center">
                <Camera size={15} className="text-purple-600 shrink-0" />
                <span>현장 카메라 직접 촬영</span>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleProcessFileToWebp}
                className="hidden"
              />
            </label>

            <label className="flex-1 min-w-[140px] cursor-pointer">
              <div className="py-2.5 px-3 rounded-2xl bg-white border border-slate-300 hover:border-purple-600 font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs hover:bg-slate-50 transition-all text-center">
                <UploadCloud size={15} className="text-purple-600 shrink-0" />
                <span>갤러리 / PC 파일 업로드</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProcessFileToWebp}
                className="hidden"
              />
            </label>
          </div>

          {/* 캐릭터 프리셋 선택 */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block">
              또는 추천 캐릭터를 원클릭으로 선택하세요:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {defaultCharacterPresets.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCharacterPreset(emoji)}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-purple-600 hover:scale-110 flex items-center justify-center text-lg shadow-2xs transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 압축 성공 인포 */}
          {compressionInfo && (
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[10px] flex items-center gap-1 font-semibold">
              <Check size={12} className="text-emerald-600" />
              <span>{compressionInfo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
