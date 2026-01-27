"use client";
import { memo, useEffect, useRef } from "react";
import nipplejs from 'nipplejs';
import ArticlesButton from "@/components/UI/Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

const arePropsEqual = (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

function JumpButtonBase() {

    const setTouchControls = useStore((state) => state.setTouchControls);
    const touchControls = useStore((state) => state.touchControls);

    return (
        <ArticlesButton
            onClick={() => {
                setTouchControls({
                    ...touchControls,
                    jump: true
                })
            }}
            style={{ padding: '20px 40px', fontSize: '1.2rem', opacity: 0.8 }}
        >
            Jump
        </ArticlesButton>
    )
}

const JumpButton = memo(JumpButtonBase);

function TouchControlsBase({  }) {

    const setTouchControls = useStore((state) => state.setTouchControls);
    const managerRef = useRef(null);

    useEffect(() => {
        const zone = document.getElementById('zone_joystick');
        if (!zone) return;

        // Clean up previous instance
        if (managerRef.current) managerRef.current.destroy();

        const options = {
            zone: zone,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
            size: 100
        };

        const manager = nipplejs.create(options);
        managerRef.current = manager;

        manager.on('move', (evt, data) => {
            if (data.direction) {
                const angle = data.angle.degree;
                // nipplejs angles: right=0, up=90, left=180, down=270
                
                let up = false;
                let down = false;
                let left = false;
                let right = false;

                // Overlapping ranges for 8-way movement
                // Up: 30 to 150
                if (angle >= 30 && angle <= 150) up = true;
                // Down: 210 to 330
                if (angle >= 210 && angle <= 330) down = true;
                // Left: 120 to 240
                if (angle >= 120 && angle <= 240) left = true;
                // Right: 300 to 360 or 0 to 60
                if (angle >= 300 || angle <= 60) right = true;

                const currentControls = useStore.getState().touchControls;
                
                // Only update if changed
                if (currentControls.up !== up || currentControls.down !== down || currentControls.left !== left || currentControls.right !== right) {
                    setTouchControls({
                        ...currentControls,
                        up, down, left, right
                    });
                }
            }
        });

        manager.on('end', () => {
             const currentControls = useStore.getState().touchControls;
             setTouchControls({
                 ...currentControls,
                 up: false, down: false, left: false, right: false
             });
        });

        return () => {
            if (managerRef.current) managerRef.current.destroy();
        };

    }, []);

    const touchControlsEnabled = useStore((state) => state.touchControlsEnabled);

    return (
        <div className={`touch-controls-area ${!touchControlsEnabled ? 'd-none' : ''}`} style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // width: '100vw',
            // height: '100vh',
            // pointerEvents: 'none', // Allow clicking through empty areas
            // zIndex: 100
        }}>
             
             {/* Joystick Container - Pointer events enabled here */}
             <div style={{
                position: 'absolute', 
                bottom: '0px', 
                left: '0px', 
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
                touchAction: 'none' // Prevent scrolling
            }} id="zone_joystick">
            </div>
            
            {/* Jump Button Container */}
            {/* <div style={{
                position: 'absolute', 
                bottom: '60px', 
                right: '40px', 
                pointerEvents: 'auto'
            }}>
                 <JumpButton />
            </div> */}

        </div>
    )
}

const TouchControls = memo(TouchControlsBase, arePropsEqual);

export default TouchControls