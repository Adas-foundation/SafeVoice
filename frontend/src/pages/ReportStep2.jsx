import { useLanguage } from '../i18n/useLanguage'

const ReportStep2 = ({ formData, updateField, isAnonymous, setIsAnonymous }) => {
  const { t } = useLanguage()
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-[24px] font-[600] text-[#00236f] font-['Poppins']">{t('report.victimTitle')}</h2>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-['Inter']">{t('report.anonymously')}</span>
          <div
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${isAnonymous ? 'bg-[#00236f]' : 'bg-[#d9e3f6]'}`}
            onClick={setIsAnonymous}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isAnonymous ? 'left-7' : 'left-1'}`}></div>
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all ${isAnonymous ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.fullName')}</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
            placeholder={t('report.fullNamePlaceholder')}
            type="text"
            value={formData.victimName}
            onChange={(e) => updateField('victimName', e.target.value)}
            disabled={isAnonymous}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.ageRange')}</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
            value={formData.victimAgeRange}
            onChange={(e) => updateField('victimAgeRange', e.target.value)}
            disabled={isAnonymous}
          >
            <option>{t('report.ageChild')}</option>
            <option>{t('report.ageMinor')}</option>
            <option>{t('report.ageAdult')}</option>
            <option>{t('report.ageSenior')}</option>
            <option>{t('report.age60')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.genderIdentity')}</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
            value={formData.victimGender}
            onChange={(e) => updateField('victimGender', e.target.value)}
            disabled={isAnonymous}
          >
            <option>{t('report.genderFemale')}</option>
            <option>{t('report.genderMale')}</option>
            <option>{t('report.genderOther')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.phoneLabel')}</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
            placeholder="+265..."
            type="tel"
            value={formData.victimPhone}
            onChange={(e) => updateField('victimPhone', e.target.value)}
            disabled={isAnonymous}
          />
        </div>
      </div>
    </div>
  )
}

export default ReportStep2