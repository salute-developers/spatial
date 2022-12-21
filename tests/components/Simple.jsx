import { useEffect } from 'react';
import { spatnavInstance } from '../../dist';

const arr = new Array(5).fill();

export const Simple = (props) => {
    useEffect(() => {
        spatnavInstance.init();

        spatnavInstance.add('s1');
    }, []);

    return (
        <div id="s1" className="sn-section-root">
            {arr.map((_, index) => {
                return (
                    <div
                        key={index}
                        id={`f${index}`}
                        tabIndex={-1}
                        className={`sn-section-item sn-section-item-s1 ${props.horizontal ? 'inline' : undefined}`}
                        data-sn-section-id="s1"
                    >
                        item {index}
                    </div>
                );
            })}
        </div>
    );
};
