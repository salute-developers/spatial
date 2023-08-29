import { SpatialNavigation } from './core';

declare global {
    interface Window {
        spatnavInstance?: SpatialNavigation;
    }
}
