
// Added any to be able to wrap Socket in our service
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackSignature = (...params: any[]) => void;

export interface ISocketService {
    on(event: string, listener: CallbackSignature): void;
    emit(event: string, ...params: unknown[]): void;
    disconnect(): void;
}
