import './CartModal.css';
import PropTypes from 'prop-types';

export default function CartModal({isVisible, onClose, children}) {
    
    if (!isVisible) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

// Add 'onClose' to props validation
CartModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};