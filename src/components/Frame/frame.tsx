import { FC, PropsWithChildren } from 'react';
import './frame.css'

const FrameComponent:FC <PropsWithChildren> = ({ children }) => {
    return (
      <div className="frame">
        {children}
      </div>
    );
  }
  
export default FrameComponent;