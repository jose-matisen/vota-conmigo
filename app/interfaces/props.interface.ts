export interface Props{
    onNext: () => void; // Prop para avanzar al siguiente paso
    onPrevious?: () => void; // Prop para retroceder al paso anterior
}