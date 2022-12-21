import { useEffect, useMemo } from 'react';
import { spatnavInstance } from '../../dist';

export const MultipleSection = ({
    s1Config,
    s2Config,
    s1Style,
    s2style,
    s1ClassName,
    s2ClassName,
    s1fStyle,
    s2fStyle,
    s1fClassName,
    s2fClassName,
    s1Length,
    s2Length,
}) => {
    useEffect(() => {
        spatnavInstance.init();

        spatnavInstance.add('s1', {
            ...s1Config,
        });

        spatnavInstance.add('s2', {
            ...s2Config,
        });
    }, [s1Config, s2Config]);

    const arr1 = useMemo(() => {
        return new Array(s1Length).fill();
    }, [s1Length]);

    const arr2 = useMemo(() => {
        return new Array(s2Length).fill();
    }, [s2Length]);

    return (
        <div>
            <div id="s1" className={`sn-section-root ${s1ClassName}`} style={s1Style}>
                {arr1.map((_, index) => {
                    return (
                        <div
                            key={index}
                            id={`s1f${index}`}
                            tabIndex={-1}
                            className={`sn-section-item sn-section-item-s1 ${s1fClassName}`}
                            data-sn-section-id="s1"
                            style={s1fStyle}
                        >
                            section 1 item {index}
                        </div>
                    );
                })}
            </div>
            <div id="s2" className={`sn-section-root ${s2ClassName}`} style={s2style}>
                {arr2.map((_, index) => {
                    return (
                        <div
                            key={index}
                            id={`s2f${index}`}
                            tabIndex={-1}
                            className={`sn-section-item sn-section-item-s2 ${s2fClassName}`}
                            data-sn-section-id="s2"
                            style={s2fStyle}
                        >
                            section 2 item {index}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
