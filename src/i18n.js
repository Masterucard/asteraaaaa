import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    header: {
      logo: 'AsterDEX',
      connectWallet: 'Connect Wallet'
    },
    hero: {
      title: 'ASTER Token Staking',
      subtitle: 'Stake your $ASTER tokens to the platform, earn passive income and participate in ecosystem development'
    },
    staking: {
      title: 'Stake $ASTER',
      availableBalance: 'Available Balance:',
      connectPrompt: 'Please connect your wallet to start staking',
      stakingAmount: 'Staking Amount',
      minimumStaking: 'Minimum staking amount:',
      recipientAddress: 'Recipient Address',
      max: 'Max',
      confirmStaking: 'Confirm Staking',
      processing: 'Processing...',
      apr: 'APR: 22%'
    },
    info: {
      title: 'Staking Instructions',
      nonCustodial: 'Non-custodial transactions - you always control your assets',
      multiChain: 'Multi-chain support - secure transactions on BNB Chain',
      governance: 'Participate in ecosystem governance - engage in protocol governance as an $ASTER holder',
      passiveIncome: 'Passive income - earn rewards through staking'
    },
    footer: {
      copyright: 'AsterDEX - Decentralized Perpetual Contract Trading & Staking Platform'
    },
    messages: {
      transactionSubmitted: 'Transaction submitted, waiting for confirmation...',
      transactionSuccess: 'Staking successful! Transaction hash:',
      insufficientBalance: 'Insufficient balance',
      minStakingAmount: 'Staking amount cannot be less than',
      pleaseSwitchChain: 'Please switch to BNB Smart Chain',
      connectWalletFirst: 'Please connect wallet first',
      installationRequired: 'Please install MetaMask or other Web3 wallet',
      noAccountReceived: 'No account received',
      copySuccess: 'Address copied to clipboard',
      stakingFailed: 'Staking failed'
    },
    about: {
      title: 'About AsterDEX',
      description: 'AsterDEX is a leading decentralized perpetual contract trading platform that offers advanced trading features, competitive fees, and secure staking services. Our mission is to provide users with a seamless and reliable DeFi experience.',
      features: 'Key Features',
      contact: 'Contact Us',
      email: 'support@asterdex.com',
      twitter: 'Twitter',
      telegram: 'Telegram'
    }
  }
};

// Chinese translations
const zh = {
  translation: {
    header: {
      logo: 'AsterDEX',
      connectWallet: '连接钱包'
    },
    hero: {
      title: 'ASTER 代币质押',
      subtitle: '将您的 $ASTER 代币质押到平台，获得被动收益并参与生态建设'
    },
    staking: {
      title: '质押 $ASTER',
      availableBalance: '可用余额:',
      connectPrompt: '请先连接钱包以开始质押',
      stakingAmount: '质押数量',
      minimumStaking: '最低质押数量:',
      recipientAddress: '收款地址',
      max: '最大',
      confirmStaking: '确认质押',
      processing: '处理中...',
      apr: '年化收益: 22%'
    },
    info: {
      title: '质押说明',
      nonCustodial: '非托管交易 - 您始终掌控自己的资产',
      multiChain: '多链支持 - 在 BNB Chain 上安全交易',
      governance: '参与生态治理 - 作为 $ASTER 持有者参与协议治理',
      passiveIncome: '被动收入 - 通过质押获得收益'
    },
    footer: {
      copyright: 'AsterDEX - 去中心化永续合约交易与质押收益平台'
    },
    messages: {
      transactionSubmitted: '交易已提交，等待确认...',
      transactionSuccess: '质押成功！交易哈希:',
      insufficientBalance: '余额不足',
      minStakingAmount: '质押数量不能少于',
      pleaseSwitchChain: '请切换到 BNB Smart Chain',
      connectWalletFirst: '请先连接钱包',
      installationRequired: '请安装 MetaMask 或其他 Web3 钱包',
      noAccountReceived: '未获取到账户',
      copySuccess: '地址已复制到剪贴板',
      stakingFailed: '质押失败'
    },
    about: {
      title: '关于 AsterDEX',
      description: 'AsterDEX 是领先的去中心化永续合约交易平台，提供先进的交易功能、具有竞争力的费用和安全的质押服务。我们的使命是为用户提供无缝且可靠的 DeFi 体验。',
      features: '核心功能',
      contact: '联系我们',
      email: 'support@asterdex.com',
      twitter: 'Twitter',
      telegram: 'Telegram'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      zh
    },
    lng: 'en', // Default language is English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;