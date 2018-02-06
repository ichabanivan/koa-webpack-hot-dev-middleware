import CONSTANTS from '../constants/';

const initialState = {
  [CONSTANTS.MODAL_STATUS]: {
    isVisible: false
  },
  [CONSTANTS.MODAL_ERROR]: {
    isVisible: false
  },
  [CONSTANTS.MODAL_REMOVE]: {
    isVisible: false
  },
  [CONSTANTS.MODAL_SHARE]: {
    isVisible: false
  }
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.MODAL_ERROR:
      return {
        ...initialState,
        [CONSTANTS.MODAL_ERROR]: {
          isVisible: true,
          error: action.payload.error || state[CONSTANTS.MODAL_ERROR].error
        }
      };

    case CONSTANTS.MODAL_REMOVE:
      return {
        ...initialState,
        [CONSTANTS.MODAL_REMOVE]: {
          isVisible: true
        }
      };

    case CONSTANTS.MODAL_STATUS:
      return {
        ...initialState,
        [CONSTANTS.MODAL_STATUS]: {
          isVisible: true
        }
      };
    
    case CONSTANTS.MODAL_SHARE:
      return {
        ...initialState,
        [CONSTANTS.MODAL_SHARE]: {
          isVisible: true
        }
      };

    case CONSTANTS.HIDE_MODALS:
      return {
        ...initialState,
        [CONSTANTS.MODAL_ERROR]: {
          isVisible: false,
          error: state[CONSTANTS.MODAL_ERROR].error
        }
      };

    default:
      return state;
  }
}
