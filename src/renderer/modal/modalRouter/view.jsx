import React from 'react';
import ModalError from 'modal/modalError';
import ModalAuthFailure from 'modal/modalAuthFailure';
import ModalDownloading from 'modal/modalDownloading';
import ModalAutoUpdateDownloaded from 'modal/modalAutoUpdateDownloaded';
import ModalAutoUpdateConfirm from 'modal/modalAutoUpdateConfirm';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalWelcome from 'modal/modalWelcome';
import ModalFirstReward from 'modal/modalFirstReward';
import ModalRewardApprovalRequired from 'modal/modalRewardApprovalRequired';
import ModalCreditIntro from 'modal/modalCreditIntro';
import ModalRemoveFile from 'modal/modalRemoveFile';
import ModalTransactionFailed from 'modal/modalTransactionFailed';
import ModalFileTimeout from 'modal/modalFileTimeout';
import ModalAffirmPurchase from 'modal/modalAffirmPurchase';
import ModalRevokeClaim from 'modal/modalRevokeClaim';
import ModalEmailCollection from 'modal/modalEmailCollection';
import ModalPhoneCollection from 'modal/modalPhoneCollection';
import ModalFirstSubscription from 'modal/modalFirstSubscription';
import ModalSendTip from '../modalSendTip';
import ModalPublish from '../modalPublish';
import ModalSearch from '../modalSearch';
import * as modals from 'constants/modal_types';

class ModalRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastTransitionModal: null,
      lastTransitionPage: null,
    };
  }

  componentWillMount() {
    this.showTransitionModals(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showTransitionModals(nextProps);
  }

  showTransitionModals(props) {
    const { modal, modalProps, openModal, page } = props;

    if (modal) {
      return;
    }

    const transitionModal = [
      this.checkShowWelcome,
      this.checkShowEmail,
      this.checkShowCreditIntro,
    ].reduce((acc, func) => (!acc ? func.bind(this)(props) : acc), false);

    if (
      transitionModal &&
      (transitionModal != this.state.lastTransitionModal || page != this.state.lastTransitionPage)
    ) {
      openModal({ id: transitionModal });
      this.setState({
        lastTransitionModal: transitionModal,
        lastTransitionPage: page,
      });
    }
  }

  checkShowWelcome(props) {
    const { isWelcomeAcknowledged, user } = props;
    if (!isWelcomeAcknowledged && user && !user.is_reward_approved && !user.is_identity_verified) {
      return modals.WELCOME;
    }
  }

  checkShowEmail(props) {
    const { isEmailCollectionAcknowledged, isVerificationCandidate, user } = props;
    if (
      !isEmailCollectionAcknowledged &&
      isVerificationCandidate &&
      user &&
      !user.has_verified_email
    ) {
      return modals.EMAIL_COLLECTION;
    }
  }

  checkShowCreditIntro(props) {
    const { balance, page, isCreditIntroAcknowledged } = props;

    if (
      balance <= 0 &&
      !isCreditIntroAcknowledged &&
      (['send', 'publish'].includes(page) || this.isPaidShowPage(props))
    ) {
      return modals.INSUFFICIENT_CREDITS;
    }
  }

  isPaidShowPage(props) {
    const { page, showPageCost } = props;
    return page === 'show' && showPageCost > 0;
  }

  render() {
    const { notification, notificationProps } = this.props;

    if (!notification) {
      return null;
    }
    switch (notification.id) {
      case modals.UPGRADE:
        return <ModalUpgrade {...notificationProps} />;
      case modals.DOWNLOADING:
        return <ModalDownloading {...notificationProps} />;
      case modals.AUTO_UPDATE_DOWNLOADED:
        return <ModalAutoUpdateDownloaded {...notificationProps} />;
      case modals.AUTO_UPDATE_CONFIRM:
        return <ModalAutoUpdateConfirm {...notificationProps} />;
      case modals.ERROR:
        return <ModalError {...notificationProps} />;
      case modals.FILE_TIMEOUT:
        return <ModalFileTimeout {...notificationProps} />;
      case modals.INSUFFICIENT_CREDITS:
        return <ModalCreditIntro {...notificationProps} />;
      case modals.WELCOME:
        return <ModalWelcome {...notificationProps} />;
      case modals.FIRST_REWARD:
        return <ModalFirstReward {...notificationProps} />;
      case modals.AUTHENTICATION_FAILURE:
        return <ModalAuthFailure {...notificationProps} />;
      case modals.TRANSACTION_FAILED:
        return <ModalTransactionFailed {...notificationProps} />;
      case modals.REWARD_APPROVAL_REQUIRED:
        return <ModalRewardApprovalRequired {...notificationProps} />;
      case modals.CONFIRM_FILE_REMOVE:
        return <ModalRemoveFile {...notificationProps} />;
      case modals.AFFIRM_PURCHASE:
        return <ModalAffirmPurchase {...notificationProps} />;
      case modals.CONFIRM_CLAIM_REVOKE:
        return <ModalRevokeClaim {...notificationProps} />;
      case modals.PHONE_COLLECTION:
        return <ModalPhoneCollection {...notificationProps} />;
      case modals.EMAIL_COLLECTION:
        return <ModalEmailCollection {...notificationProps} />;
      case modals.FIRST_SUBSCRIPTION:
        return <ModalFirstSubscription {...notificationProps} />;
      case modals.SEND_TIP:
        return <ModalSendTip {...notificationProps} />;
      case modals.PUBLISH:
        return <ModalPublish {...notificationProps} />;
      case modals.SEARCH:
        return <ModalSearch {...notificationProps} />;
      default:
        return null;
    }
  }
}

export default ModalRouter;
