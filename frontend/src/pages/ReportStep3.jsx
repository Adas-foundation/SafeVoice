import { useLanguage } from '../i18n/useLanguage'

const ReportStep3 = ({ formData, updateField }) => {
  const { t } = useLanguage()
  const THREAT_OPTIONS = [
    { value: 'Yes', label: t('report.threatYes') },
    { value: 'No', label: t('report.threatNo') },
    { value: "I'm not sure", label: t('report.threatNotSure') },
  ]

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <h2 className="text-[24px] font-[600] mb-6 text-[#00236f] font-['Poppins']">{t('report.incidentDescTitle')}</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.whenHappened')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
              type="date"
              value={formData.incidentDate}
              onChange={(e) => updateField('incidentDate', e.target.value)}
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all font-['Inter']"
              type="time"
              value={formData.incidentTime}
              onChange={(e) => updateField('incidentTime', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.whatHappenedLabel')}</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all resize-none font-['Inter']"
            placeholder={t('report.whatHappenedPlaceholder')}
            rows={3}
            value={formData.whatHappened}
            onChange={(e) => updateField('whatHappened', e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.beforeIncidentLabel')}</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all resize-none font-['Inter']"
            placeholder={t('report.beforeIncidentPlaceholder')}
            rows={3}
            value={formData.beforeIncident}
            onChange={(e) => updateField('beforeIncident', e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.whoElseLabel')}</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all resize-none font-['Inter']"
            placeholder={t('report.whoElsePlaceholder')}
            rows={2}
            value={formData.whoElse}
            onChange={(e) => updateField('whoElse', e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.afterIncidentLabel')}</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all resize-none font-['Inter']"
            placeholder={t('report.afterIncidentPlaceholder')}
            rows={2}
            value={formData.afterIncident}
            onChange={(e) => updateField('afterIncident', e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.additionalInfoLabel')}</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00236f] focus:outline-none transition-all resize-none font-['Inter']"
            placeholder={t('report.additionalInfoPlaceholder')}
            rows={2}
            value={formData.additionalInfo}
            onChange={(e) => updateField('additionalInfo', e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] text-gray-800 font-['Inter']">{t('report.threatQuestion')}</label>
          <div className="flex flex-wrap gap-4">
            {THREAT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`px-6 py-2 border-2 rounded-lg text-[14px] transition-colors font-['Inter'] ${
                  formData.immediateThreat === option.value
                    ? 'border-[#00236f] bg-[#00236f] text-white'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                type="button"
                onClick={() => updateField('immediateThreat', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportStep3