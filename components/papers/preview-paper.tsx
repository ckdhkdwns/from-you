'use client';

import React, { useState, useEffect } from 'react';

import { TemplateConfigPublic } from '@/models/types/template-config';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadonlyPaper from '@/components/papers/readonly-paper';

interface PreviewPaperProps {
    config?: TemplateConfigPublic;
    paperImage?: string;
}

export default function PreviewPaper({ config, paperImage }: PreviewPaperProps) {
    const [currentConfig, setCurrentConfig] = useState<TemplateConfigPublic>({
        paperSize: {
            width: 210, // A4 기본 너비 (mm)
            height: 297, // A4 기본 높이 (mm)
        },
        photoSize: {
            width: 50, // 기본 사진 너비 (mm)
            height: 70, // 기본 사진 높이 (mm)
        },
        padding: {
            top: 20, // mm
            right: 20, // mm
            bottom: 20, // mm
            left: 20, // mm
        },
        lineHeight: 6, // mm
        fontSize: {
            small: 3, // mm
            medium: 4, // mm
            large: 5, // mm
        },
    } as TemplateConfigPublic);

    const [selectedFontSize, setSelectedFontSize] = useState<'small' | 'medium' | 'large'>(
        'medium',
    );

    useEffect(() => {
        if (config) {
            setCurrentConfig(config);
        }
    }, [config]);

    // 샘플 텍스트
    const sampleText = `편지(便紙, 片紙 / letter)란, 종이 등의 매체에 안부·소식·용무 따위를 글로 적어보내는 것을 말한다. 서신(書信)이라고도 부른다. 문자가 발명된 이후, 인류 최초의 원거리 통신 방식이다. 고대에서부터 근대까지는 직접 종이에다 글을 써서 상대방한테 보내줬다. 이후 편지를 배달하는 것을 전문으로 하는 기관인 우체국이 등장함에 따라 근현대에는 배달 시스템에 많이 의존하였다. 편지의 운송요금을 납부했음을 알리는 것으로 우표가 있다. 물론 직접 전달하는 방식의 편지도 여전히 유효하게 활용되었다. 인터넷의 발달로 이메일이나 모바일 메신저가 널리 퍼지면서 지금은 일반적인 대화 수단으로서의 편지는 잘 쓰지 않게 되었지만, 보낸 이의 손글씨가 그대로 드러나고 실시간으로 대화가 불가능한 편지의 특성상 인간의 낭만을 담은 로맨틱한 것으로 인식되는 경우가 많다. 천리면목(千里面目)이라고도 하며, 이는 천리 밖에서도 얼굴 보듯한다는 뜻이다. 즉 멀리 있는 이의 얼굴을 보고 말한다는 의미로 편지의 속성을 잘 나타내는 표현이다. 지금은 잘 쓰이지 않지만 순우리말로 '글월'이라 하기도 한다. 한때 훈련소에 입소한 남자에게 소식을 전할 때 쓰는 것으로 인식되기도 했으나 인터넷편지의 등장으로 이마저도 거의 사라져가는 추세이다. 특히 남자의 경우에는 편지 문화가 거의 사장되어 가고 있으나, 여자의 경우에는 편지가 간략화된 쪽지의 형식으로 많이 주고받는다고 한다. 재미있게도 이메일, 문자메시지, 카카오톡 등에도 불구하고 우편 발송량은 크게 줄지 않았다. 21세기 들어서도 금융위기가 있었던 2008년을 제외하면 2019년 지금까지도 오히려 우편 발송량은 조금씩이나마 늘고 있는게 사실이다. 개인간 보내는 편지나 엽서 등은 급격히 사장되고 있지만, 기업이나 정부, 학교 등 기관에서 보내는 우편물은 오히려 늘고 있기 때문이다. 덕분에 편지 발송량은 늘어나는데 우표 발행량은 급격히 줄고 있다고. 어떤 노래가사에 따르면 가을이 되면 편지를 하는 것이라 한다. 체인 레터(Chain Letter)라고 하여 비상연락망처럼 편지가 손에서 손으로 이어지는 경우도 있다. 하지만 "이 편지는 영국에서 시작되어~"로 유명한 '얼마 안에 몇 사람에게 돌려주세요' 식의 편지는 엄연한 스팸이다. <펌프킨 시저스> 19권에서는 작중 한 작가의 소설 <전신세계>에서 편지에 대해 이야기한다. 무서울 정도로 통신기술이 발달하여 편지의 가치가 (오르든 내리든) 변해 '편지밖에 없었던 시절의 편지'는 세상에서 사라지고 '편지밖에 없었던 세상'은 멸망했다는 내용이다.`;

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
            <div>
                <ReadonlyPaper
                    font={{
                        size: selectedFontSize,
                        color: '#000',
                        family: 'Pretendard-Regular',
                        align: 'left',
                    }}
                    text={sampleText}
                    config={currentConfig}
                    paperImage={paperImage}
                />
            </div>

            <Tabs
                value={selectedFontSize}
                onValueChange={value => setSelectedFontSize(value as 'small' | 'medium' | 'large')}
                className="mt-4"
            >
                <TabsList>
                    <TabsTrigger value="small">작은 글자</TabsTrigger>
                    <TabsTrigger value="medium">중간 글자</TabsTrigger>
                    <TabsTrigger value="large">큰 글자</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
