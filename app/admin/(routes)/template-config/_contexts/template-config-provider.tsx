'use client';

import { TemplateConfigPublic } from '@/models/types/template-config';
import { createContext, useState, useContext } from 'react';

interface TemplateConfigContextType {
    config: TemplateConfigPublic;
    updateConfig: (_newConfig: TemplateConfigPublic) => void;
}

export const TemplateConfigContext = createContext<TemplateConfigContextType | null>(null);

export const useTemplateConfig = () => {
    const context = useContext(TemplateConfigContext);
    if (!context) {
        throw new Error('useTemplateConfig는 TemplateConfigProvider 내부에서만 사용할 수 있습니다');
    }
    return context;
};

export const TemplateConfigProvider = ({
    children,
    initialConfig,
}: {
    children: React.ReactNode;
    initialConfig: TemplateConfigPublic;
}) => {
    const [config, setConfig] = useState<TemplateConfigPublic>(initialConfig);

    const updateConfig = (newConfig: TemplateConfigPublic) => {
        setConfig(newConfig);
    };

    return (
        <TemplateConfigContext.Provider value={{ config, updateConfig }}>
            {children}
        </TemplateConfigContext.Provider>
    );
};
