import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import './App.css'

// 配置常量
const BNB_CHAIN_ID = '0x38' // BNB Chain 主网 Chain ID: 56
const BNB_CHAIN_ID_DECIMAL = 56
const ASTER_TOKEN_ADDRESS = '0x000ae314e2a2172a039b26378814c252734f556a'
const STAKING_ADDRESS = '0xfADAfaF07785fff748D84D0E5AC5de631577a10d'
const MIN_STAKING_AMOUNT = 500 // 最低质押数量

// ERC20 ABI (只需要 balanceOf 和 transfer)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
]

function App() {
  const { t, i18n } = useTranslation()
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [balance, setBalance] = useState('0')
  const [tokenSymbol, setTokenSymbol] = useState('ASTER')
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [stakingAmount, setStakingAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [chainId, setChainId] = useState(null)

  // Toggle language between English and Chinese
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
  }

  // 检查并切换到 BNB Chain
  const switchToBNBChain = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(t('messages.installationRequired'))
      }

      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      if (currentChainId !== BNB_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BNB_CHAIN_ID }],
          })
        } catch (switchError) {
          // 如果链不存在，添加链
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BNB_CHAIN_ID,
                chainName: 'BNB Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
              }],
            })
          } else {
            throw switchError
          }
        }
      }
      return true
    } catch (error) {
      console.error('切换链失败:', error)
      setError(`Switch chain failed: ${error.message}`)
      return false
    }
  }

  // 连接钱包
  const connectWallet = async () => {
    try {
      setError('')
      setSuccess('')

      if (!window.ethereum) {
        throw new Error('请安装 MetaMask 或其他 Web3 钱包')
      }

      // 先切换到 BNB Chain
      const switched = await switchToBNBChain()
      if (!switched) {
        return
      }

      // 请求账户访问
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error(t('messages.noAccountReceived'))
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(accounts[0])
      setChainId(network.chainId.toString())

      // 加载代币余额
      await loadTokenBalance(provider, accounts[0])

    } catch (error) {
        console.error('连接钱包失败:', error)
        setError(`Connect wallet failed: ${error.message}`)
      }
  }

  // 加载代币余额
  const loadTokenBalance = async (providerInstance, accountAddress) => {
    try {
      const tokenContract = new ethers.Contract(
        ASTER_TOKEN_ADDRESS,
        ERC20_ABI,
        providerInstance
      )

      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(accountAddress),
        tokenContract.decimals(),
        tokenContract.symbol()
      ])

      setBalance(ethers.formatUnits(balance, decimals))
      setTokenDecimals(decimals)
      setTokenSymbol(symbol || 'ASTER')
    } catch (error) {
      console.error('加载余额失败:', error)
      setError(`Load balance failed: ${error.message}`)
    }
  }

  // 监听账户和链变化
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null)
        setProvider(null)
        setSigner(null)
        setBalance('0')
      } else {
        setAccount(accounts[0])
        if (provider) {
          loadTokenBalance(provider, accounts[0])
        }
      }
    }

    const handleChainChanged = async (chainId) => {
      setChainId(parseInt(chainId, 16).toString())
      // 如果切换到非 BNB Chain，提示用户
        if (chainId !== BNB_CHAIN_ID) {
          setError(t('messages.pleaseSwitchChain'))
          await switchToBNBChain()
        } else {
        setError('')
        if (account && provider) {
          await loadTokenBalance(provider, account)
        }
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [provider, account])

  // 质押代币
  const handleStake = async () => {
    try {
      setError('')
      setSuccess('')
      setIsLoading(true)

      if (!signer) {
        throw new Error(t('messages.connectWalletFirst'))
      }

      // 检查链
      const network = await provider.getNetwork()
      if (network.chainId.toString() !== BNB_CHAIN_ID_DECIMAL.toString()) {
        const switched = await switchToBNBChain()
        if (!switched) {
          setIsLoading(false)
          return
        }
        // 重新获取 signer
        const newSigner = await provider.getSigner()
        setSigner(newSigner)
      }

      // 验证质押数量
      const amount = parseFloat(stakingAmount)
      if (isNaN(amount) || amount < MIN_STAKING_AMOUNT) {
        throw new Error(`${t('messages.minStakingAmount')} ${MIN_STAKING_AMOUNT} ${tokenSymbol}`)
      }

      // 检查余额
      const balanceNum = parseFloat(balance)
      if (amount > balanceNum) {
        throw new Error(t('messages.insufficientBalance'))
      }

      // 创建代币合约实例
      const tokenContract = new ethers.Contract(
        ASTER_TOKEN_ADDRESS,
        ERC20_ABI,
        signer
      )

      // 转换数量为 wei
      const amountWei = ethers.parseUnits(stakingAmount, tokenDecimals)

      // 发送转账交易
      const tx = await tokenContract.transfer(STAKING_ADDRESS, amountWei)
      setSuccess(`${t('messages.transactionSubmitted')} (${tx.hash})`)

      // 等待交易确认
      await tx.wait()
      setSuccess(`${t('messages.transactionSuccess')} ${tx.hash}`)
      setStakingAmount('')

      // 刷新余额
      await loadTokenBalance(provider, account)

    } catch (error) {
      console.error('质押失败:', error)
      if (error.reason) {
        setError(`质押失败: ${error.reason}`)
      } else if (error.message) {
        setError(`${t('messages.stakingFailed')}: ${error.message}`)
      } else {
        setError(t('messages.stakingFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 格式化地址
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">{t('header.logo')}</h1>
          <div className="header-right">
            {/* Language Toggle Button */}
            <button className="language-toggle" onClick={toggleLanguage}>
              {i18n.language === 'en' ? '中文' : 'English'}
            </button>
            {account ? (
              <div className="wallet-info">
                <span className="chain-badge">BNB Chain</span>
                <span className="address">{formatAddress(account)}</span>
                <span className="balance-display">
                  {parseFloat(balance).toFixed(2)} {tokenSymbol}
                </span>
              </div>
            ) : (
              <button className="connect-btn" onClick={connectWallet}>
                {t('header.connectWallet')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h2 className="title">{t('hero.title')}</h2>
            <p className="subtitle">
              {t('hero.subtitle')}
            </p>
            {/* APR Display */}
            <div className="apr-display">
              <span className="apr-label">{t('staking.apr')}</span>
            </div>
          </div>

          <div className="staking-card">
            <div className="card-header">
              <h3>{t('staking.title')}</h3>
              {account && (
                <div className="balance-info">
                  <span>{t('staking.availableBalance')}</span>
                  <span className="highlight">{parseFloat(balance).toFixed(2)} {tokenSymbol}</span>
                </div>
              )}
            </div>

            {!account ? (
              <div className="connect-prompt">
                <p>{t('staking.connectPrompt')}</p>
                <button className="connect-btn-large" onClick={connectWallet}>
                  {t('header.connectWallet')}
                </button>
              </div>
            ) : (
              <div className="staking-form">
                <div className="form-group">
                  <label>{t('staking.stakingAmount')}</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      placeholder={`${t('staking.minimumStaking')} ${MIN_STAKING_AMOUNT} ${tokenSymbol}`}
                      value={stakingAmount}
                      onChange={(e) => setStakingAmount(e.target.value)}
                      min={MIN_STAKING_AMOUNT}
                      step="0.01"
                    />
                    <button
                      className="max-btn"
                      onClick={() => setStakingAmount(balance)}
                    >
                      {t('staking.max')}
                    </button>
                  </div>
                  <div className="form-hint">
                    <span>{t('staking.minimumStaking')} <span className="highlight">{MIN_STAKING_AMOUNT} {tokenSymbol}</span></span>
                  </div>
                </div>

                {error && (
                  <div className="message error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="message success">
                    {success}
                  </div>
                )}

                <button
                  className="stake-btn"
                  onClick={handleStake}
                  disabled={isLoading || !stakingAmount || parseFloat(stakingAmount) < MIN_STAKING_AMOUNT}
                >
                  {isLoading ? t('staking.processing') : t('staking.confirmStaking')}
                </button>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>{t('info.title')}</h3>
            <ul className="info-list">
              <li>✅ {t('info.nonCustodial')}</li>
              <li>✅ {t('info.multiChain')}</li>
              <li>✅ {t('info.governance')}</li>
              <li>✅ {t('info.passiveIncome')}</li>
            </ul>
          </div>

          {/* About Section */}
          <div className="about-section">
            <h3>{t('about.title')}</h3>
            <p>{t('about.description')}</p>
            <div className="features-grid">
              <div className="feature-card">
                <h4>Advanced Trading</h4>
                <p>Perpetual contracts with up to 100x leverage</p>
              </div>
              <div className="feature-card">
                <h4>Low Fees</h4>
                <p>Competitive trading fees starting from 0.02%</p>
              </div>
              <div className="feature-card">
                <h4>Security</h4>
                <p>Non-custodial design with industry-leading security</p>
              </div>
              <div className="feature-card">
                <h4>Community Driven</h4>
                <p>Decentralized governance with ASTER token holders</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <h3>{t('about.contact')}</h3>
            <div className="contact-info">
              <p><strong>Email:</strong> {t('about.email')}</p>
              <div className="social-links">
                <a href="#" className="social-link">{t('about.twitter')}</a>
                <a href="#" className="social-link">{t('about.telegram')}</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  )
}

export default App

