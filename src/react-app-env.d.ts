/// <reference types="react-scripts" />
import { Provider } from '@ethersproject/providers';

declare global {
    interface Window {
        ethereum?: Web3Provider;
    }
}
