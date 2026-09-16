import { useLanguage } from '../i18n/useLanguage'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-[#00236f] text-white w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-8 gap-4 w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4 w-full">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 flex-wrap w-full">
            <span className="text-[14px] text-white/80 font-['Inter']">
              {t('footer.ministry')}
            </span>
            <nav className="flex flex-wrap gap-6 justify-center">
              <a className="text-white/80 font-['Inter'] hover:text-white hover:underline transition-colors" href="/resources">{t('footer.privacy')}</a>
              <a className="text-white/80 font-['Inter'] hover:text-white hover:underline transition-colors" href="/resources">{t('footer.terms')}</a>
              <a className="text-white/80 font-['Inter'] hover:text-white hover:underline transition-colors" href="/contact">{t('footer.help')}</a>
              <a className="text-white/80 font-['Inter'] hover:text-white hover:underline transition-colors" href="/contact">{t('footer.contact')}</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer