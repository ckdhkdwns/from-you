import React from "react";
import { Separator } from "@/components/ui/separator";
import { useLetter } from "../../_contexts/letter-provider";
import PickColorButton from "./pick-color-button";
import PickEmojiButton from "./pick-emoji-button";
import { toast } from "sonner";
import FontFamilySelect from "./font-family-select";
import FontSizeSelect from "./font-size-select";
import FontAlignSelect from "./font-align-select";

export default function Toolbar() {
    const { font, setFont, setText } = useLetter();

    const handleFontFamilyChange = (value: string) => {
        setFont({
            ...font,
            family: value,
        });
    };

    const handleFontSizeChange = (value: string) => {
        setFont({
            ...font,
            size: value as "small" | "medium" | "large",
        });
    };

    const handleAlignChange = (value: "left" | "center" | "right") => {
        setFont({
            ...font,
            align: value,
        });
    };

    const handleFontColorChange = (value: string) => {
        setFont({
            ...font,
            color: value,
        });
    };

    const handleAddPage = () => {
        setText((prev) => [...prev, ""]);
        toast.success("편지지가 추가되었습니다.");
    };

    return (
        <div className="sticky top-0 flex flex-col w-full px-4 pb-4 border-b pt-4 border-gray-200 md:flex-row md:justify-between md:items-center md:px-6">
            {/* 모바일 레이아웃: 상단 섹션 */}
            <div className="w-full flex  items-center mb-3 md:mb-0 md:w-auto justify-start md:gap-4 gap-2">
                {/* 폰트 패밀리와 사이즈 */}
                <div className="flex items-center gap-3">
                    <FontFamilySelect
                        onValueChange={handleFontFamilyChange}
                        value={font.family}
                    />
                    <FontSizeSelect
                        onValueChange={handleFontSizeChange}
                        value={font.size}
                    />
                </div>

                {/* 모바일에서 오른쪽에 보이는 아이콘들 - 정렬은 이제 select로 보임 */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* 정렬 선택을 첫 번째로 배치 */}
                    <FontAlignSelect
                        fontAlign={font.align}
                        onFontAlignChange={handleAlignChange}
                    />
                    <PickColorButton
                        fontColor={font.color}
                        onColorChange={handleFontColorChange}
                    />
                    <PickEmojiButton />
                </div>
            </div>

            {/* 데스크탑 전용 레이아웃 - 중간 섹션 */}
            <div className="hidden md:flex md:justify-start md:items-center md:relative md:gap-4">
                <Separator
                    orientation="vertical"
                    className="h-3.5 hidden md:block"
                />
                <div className="hidden md:flex md:justify-start md:items-center md:relative md:gap-3">
                    <FontAlignSelect
                        fontAlign={font.align}
                        onFontAlignChange={handleAlignChange}
                    />
                    <PickColorButton
                        fontColor={font.color}
                        onColorChange={handleFontColorChange}
                    />
                </div>
                <Separator
                    orientation="vertical"
                    className="h-3.5 hidden md:block"
                />
                <div className="hidden md:block">
                    <PickEmojiButton />
                </div>
            </div>

            {/* 편지지 변경/추가 섹션 */}
            <div className="flex justify-start items-center gap-3 w-full mt-1 md:mt-0 md:w-auto">
                {/* <p className="text-xs text-left text-gray-450 cursor-pointer hover:text-primary-black">
                    편지지 변경
                </p>
                <Separator orientation="vertical" className="h-3" /> */}
                <p
                    className="text-xs text-left text-gray-450 cursor-pointer hover:text-primary-black"
                    onClick={() => handleAddPage()}
                >
                    편지지 추가
                </p>
            </div>
        </div>
    );
}
