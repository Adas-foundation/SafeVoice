import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportStep1 from './ReportStep1'
import ReportStep2 from './ReportStep2'
import ReportStep3 from './ReportStep3'
import ReportStep4 from './ReportStep4'
import ReportStep5 from './ReportStep5'
import { createReport, uploadAllEvidence } from '../services/reportsApi'
import { useLanguage } from '../i18n/useLanguage'

const initialFormData = {
  incidentType: '',
  needsEmergencyHelp: false,
  isAnonymous: false,
  victimName: '',
  victimAgeRange: '0 - 12 (Child)',
  victimGender: 'Female',
  victimPhone: '',
  incidentDate: '',
  incidentTime: '',
  whatHappened: '',
  immediateThreat: '',
  districtId: null,
  landmark: '',
  latitude: null,
  longitude: null,
  files: [],
  consent: false,
}

const Report = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 5

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateStepUI = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Returns an error message string when the given step is incomplete,
  // otherwise an empty string. Fields unique to a step are validated so the
  // user cannot skip ahead. Districts load from the live backend via
  // districtsApi (ReportStep4) — those are untouched; the check simply
  // ensures a district is chosen.
  const validateStep = (step) => {
    if (step === 1 && !formData.incidentType) {
      return t('report.errorStep1')
    }
    if (step === 2 && !formData.isAnonymous && !formData.victimName.trim()) {
      return t('report.errorStep2')
    }
    if (step === 3) {
      if (!formData.incidentDate || !formData.incidentTime || !formData.whatHappened.trim()) {
        return t('report.errorStep3')
      }
      if (!formData.immediateThreat) {
        return t('report.errorStep3Threat')
      }
    }
    if (step === 4 && !formData.districtId) {
      return t('report.errorStep4')
    }
    return ''
  }

  const handleNext = () => {
    const msg = validateStep(currentStep)
    if (msg) {
      setError(msg)
      updateStepUI()
      return
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      updateStepUI()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      updateStepUI()
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleStepClick = (step) => {
    // Allow moving back freely, and allow staying on the current step.
    if (step < currentStep) {
      setCurrentStep(step)
      updateStepUI()
      return
    }
    if (step === currentStep) return
    // Moving forward requires every step before the target to be complete.
    for (let s = currentStep; s < step; s++) {
      const msg = validateStep(s)
      if (msg) {
        setError(msg)
        setCurrentStep(s)
        updateStepUI()
        return
      }
    }
    setCurrentStep(step)
    updateStepUI()
  }

  const toggleAnonymous = () => {
    updateField('isAnonymous', !formData.isAnonymous)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.consent) {
      setError(t('report.errorConsent'))
      setCurrentStep(5)
      updateStepUI()
      return
    }

    if (!formData.districtId) {
      setError(t('report.errorDistrict'))
      setCurrentStep(4)
      updateStepUI()
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: create the report itself (description + districtId only —
      // see reportsApi.js for what's folded into the description text)
      const report = await createReport(formData)

      // Step 2: if evidence files were attached, upload them against the
      // now-known report id. Failures here are logged but don't block
      // navigation — the report itself was already saved successfully.
      if (formData.files.length > 0) {
        const results = await uploadAllEvidence(report.id, formData.files)
        const failures = results.filter((r) => r?.error)
        if (failures.length > 0) {
          console.warn(`${failures.length} evidence file(s) failed to upload`, failures)
        }
      }

      navigate('/submitted', {
        state: { referenceNumber: report.referenceNumber },
      })
    } catch (err) {
      console.error('Report submission error', err)
      // Browser-level network failure (backend down / unreachable) surfaces as
      // a TypeError with "Failed to fetch" — replace it with an actionable
      // message instead of the raw error. Server-side failures (non-2xx) are
      // already turned into readable messages by handleResponse.
      const isNetworkError = err instanceof TypeError || /failed to fetch/i.test(String(err?.message || ''))
      setError(isNetworkError ? t('report.serverUnreachable') : err.message || t('report.errorSubmit'))
      updateStepUI()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
      </div>
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#d9e3f6] -z-10 -translate-y-1/2"></div>
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleStepClick(1)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white shadow-sm ${currentStep >= 1 ? 'bg-[#00236f] text-white' : 'bg-[#d9e3f6] text-gray-600'} hover:scale-110`}>
              {currentStep > 1 ? <span className="material-symbols-outlined text-sm">check</span> : '1'}
            </div>
            <span className={`text-[12px] font-['Inter'] ${currentStep === 1 ? 'text-[#00236f]' : 'text-gray-600'}`}>{t('report.step1')}</span>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleStepClick(2)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white shadow-sm ${currentStep >= 2 ? 'bg-[#006a63] text-white' : 'bg-[#d9e3f6] text-gray-600'} hover:scale-110`}>
              {currentStep > 2 ? <span className="material-symbols-outlined text-sm">check</span> : '2'}
            </div>
            <span className={`text-[12px] font-['Inter'] ${currentStep === 2 ? 'text-[#00236f]' : 'text-gray-600'}`}>{t('report.step2')}</span>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleStepClick(3)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white shadow-sm ${currentStep >= 3 ? 'bg-[#006a63] text-white' : 'bg-[#d9e3f6] text-gray-600'} hover:scale-110`}>
              {currentStep > 3 ? <span className="material-symbols-outlined text-sm">check</span> : '3'}
            </div>
            <span className={`text-[12px] font-['Inter'] ${currentStep === 3 ? 'text-[#00236f]' : 'text-gray-600'}`}>{t('report.step3')}</span>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleStepClick(4)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white shadow-sm ${currentStep >= 4 ? 'bg-[#006a63] text-white' : 'bg-[#d9e3f6] text-gray-600'} hover:scale-110`}>
              {currentStep > 4 ? <span className="material-symbols-outlined text-sm">check</span> : '4'}
            </div>
            <span className={`text-[12px] font-['Inter'] ${currentStep === 4 ? 'text-[#00236f]' : 'text-gray-600'}`}>{t('report.step4')}</span>
          </div>
          {/* Step 5 */}
          <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleStepClick(5)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white shadow-sm ${currentStep >= 5 ? 'bg-[#006a63] text-white' : 'bg-[#d9e3f6] text-gray-600'} hover:scale-110`}>
              {currentStep > 5 ? <span className="material-symbols-outlined text-sm">check</span> : '5'}
            </div>
            <span className={`text-[12px] font-['Inter'] ${currentStep === 5 ? 'text-[#00236f]' : 'text-gray-600'}`}>{t('report.step5')}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-['Inter']">
          {error}
        </div>
      )}

      {/* Form Sections Container */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Section 1: Incident Type */}
        {currentStep === 1 && <ReportStep1 formData={formData} updateField={updateField} />}

        {/* Section 2: Victim Information */}
        {currentStep === 2 && (
          <ReportStep2 formData={formData} updateField={updateField} isAnonymous={formData.isAnonymous} setIsAnonymous={toggleAnonymous} />
        )}

        {/* Section 3: Incident Details */}
        {currentStep === 3 && <ReportStep3 formData={formData} updateField={updateField} />}

        {/* Section 4: Location */}
        {currentStep === 4 && <ReportStep4 formData={formData} updateField={updateField} />}

        {/* Section 5: Evidence */}
        {currentStep === 5 && <ReportStep5 formData={formData} updateField={updateField} />}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-12">
          <button
            className={`flex items-center gap-2 px-8 py-3 border-2 border-[#00236f] text-[#00236f] font-semibold rounded-xl hover:bg-[#1e3a8a]/10 transition-all font-['Inter'] ${currentStep === 1 ? 'invisible' : ''}`}
            type="button"
            onClick={handlePrev}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {t('report.previous')}
          </button>
          {currentStep < totalSteps ? (
            <button
              className="flex items-center gap-2 px-10 py-4 bg-[#00236f] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all font-['Poppins']"
              type="button"
              onClick={handleNext}
            >
              {t('report.continue')}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-12 py-4 bg-[#006a63] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all font-['Poppins'] disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('report.submitting') : t('report.submit')}
              <span className="material-symbols-outlined">shield_with_heart</span>
            </button>
          )}
        </div>
      </form>
    </main>
  )
}

export default Report