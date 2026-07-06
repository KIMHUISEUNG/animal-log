import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ImageViewerModal({
  images,
  initialIndex,
  open,
  onOpenChange,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen w-screen max-w-none border-0 bg-black/95 p-0 text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">이미지 상세보기 모달창</DialogTitle>
          <DialogDescription className="sr-only">
            이미지 상세보기 모달입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="absolute top-1.5 right-1.5 z-10 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {hasMultipleImages && (
          <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 text-sm text-white/80">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <TransformWrapper
          key={currentIndex}
          initialScale={1}
          minScale={1}
          maxScale={3}
          centerOnInit
          wheel={{ step: 0.025 }}
          doubleClick={{ mode: "toggle" }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-md bg-black/50 p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => zoomOut()}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => resetTransform()}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => zoomIn()}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </div>

              <TransformComponent
                wrapperClass="!h-full !w-full"
                contentClass="!h-full !w-full"
              >
                <div className="flex h-screen w-screen items-center justify-center">
                  <img
                    src={currentImage}
                    alt=""
                    className="max-h-screen max-w-screen object-contain"
                    draggable={false}
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {hasMultipleImages && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrevClick}
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleNextClick}
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
