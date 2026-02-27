import { Zap } from "lucide-react";

export const Header = () => {
    return (
        <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
                <Zap className="text-primary" size={24} />
                <h1 className="text-xl font-bold text-foreground tracking-tight">AutoForm</h1>
            </div>
            <p className="text-sm text-muted-foreground">
                Preencha formulários automaticamente com dados aleatórios
            </p>
        </div>
    )
}
