'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import { useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ImageIcon, Upload } from 'lucide-react';

import { BookingHubInputField } from '@/components/BookingHubInputField';
import { BookingHubPrimaryButton, BookingHubSecondaryButton } from '@/components/booking-hub-button';
import { BookingHubSelectField } from '@/components/booking-hub-select/BookingHubSelectField';
import { cn } from '@/lib/utils';

import {
  BH_ADD_PROPERTY_NAV_MAX_W,
  MANUAL_PARKING_OPTIONS,
  MANUAL_PROPERTY_TYPE_OPTIONS,
  propertyManualListingSchema,
  type PropertyForm,
} from './propertyManualListingSchema';

export type PropertyManualListingFormHandle = {
  isNativeCameraBusy: () => boolean;
};

export type PropertyManualListingFormProps = {
  defaultValues: DefaultValues<PropertyForm>;
  /** Bump when the shell wants a fresh form instance (open modal, switch to manual flow, new edit preset). */
  resetKey: number;
  /** When set, seeds ≥5 photos after reset (partner edit preset). */
  seedPhotosFromPublicPath?: string | null;
  submitError: string | null;
  loading: boolean;
  onSubmit: (data: PropertyForm & { photos: FileList | null }) => Promise<void>;
  submitLabel?: string;
  loadingSubmitLabel?: string;
};

function PropertyManualListingFormInner(
  {
    defaultValues,
    resetKey,
    seedPhotosFromPublicPath,
    submitError,
    loading,
    onSubmit,
    submitLabel = 'List my property',
    loadingSubmitLabel = 'Adding property…',
  }: PropertyManualListingFormProps,
  ref: Ref<PropertyManualListingFormHandle>,
) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([]);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isProcessingCameraRef = useRef(false);
  const cameraFilesProcessedRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    isNativeCameraBusy: () => isProcessingCameraRef.current,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
    getValues,
  } =   useForm<PropertyForm>({
    resolver: zodResolver(propertyManualListingSchema),
    defaultValues,
  });

  const stopCameraStreamInner = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    reset(defaultValues);
    setSelectedFiles(null);
    setCapturedPhotos([]);
    setShowCameraModal(false);
    stopCameraStreamInner();
  }, [resetKey, defaultValues, reset, stopCameraStreamInner]);

  useEffect(() => {
    if (!seedPhotosFromPublicPath || resetKey < 1) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(seedPhotosFromPublicPath);
        const blob = await res.blob();
        const dt = new DataTransfer();
        for (let i = 0; i < 5; i++) {
          dt.items.add(new File([blob], `property-photo-${i + 1}.jpg`, { type: 'image/jpeg' }));
        }
        if (!cancelled) {
          setSelectedFiles(dt.files);
          setValue('photos', dt.files);
          void trigger('photos');
        }
      } catch {
        /* seed is best-effort */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resetKey, seedPhotosFromPublicPath, setValue, trigger]);

  const cleanupPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const handleFormSubmit = async (data: PropertyForm) => {
    const formDataWithFiles = {
      ...(getValues() as PropertyForm),
      ...data,
      photos: selectedFiles,
    };
    await onSubmit(formDataWithFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      const existingFiles = selectedFiles ? Array.from(selectedFiles) : [];
      const newFilesArray = Array.from(newFiles);
      const allFiles = [...existingFiles, ...newFilesArray];

      const dataTransfer = new DataTransfer();
      allFiles.forEach((file) => dataTransfer.items.add(file));
      const combinedFileList = dataTransfer.files;

      setSelectedFiles(combinedFileList);
      setValue('photos', combinedFileList);
      void trigger('photos');

      e.target.value = '';
    }
  };

  const processCameraFiles = useCallback(
    (newFiles: FileList) => {
      if (newFiles && newFiles.length > 0) {
        setSelectedFiles((prevFiles) => {
          const existingFiles = prevFiles ? Array.from(prevFiles) : [];
          const newFilesArray = Array.from(newFiles);
          const allFiles = [...existingFiles, ...newFilesArray];

          const dataTransfer = new DataTransfer();
          allFiles.forEach((file) => dataTransfer.items.add(file));
          const combinedFileList = dataTransfer.files;

          setValue('photos', combinedFileList);
          void trigger('photos');

          const photoInput = document.getElementById('photos') as HTMLInputElement;
          if (photoInput) {
            const hiddenInputDataTransfer = new DataTransfer();
            allFiles.forEach((file) => hiddenInputDataTransfer.items.add(file));
            photoInput.files = hiddenInputDataTransfer.files;
          }

          return combinedFileList;
        });
      }
    },
    [setValue, trigger],
  );

  const handleCameraFilesReady = useCallback(
    (files: FileList) => {
      if (cameraFilesProcessedRef.current || !files || files.length === 0) {
        return;
      }

      cameraFilesProcessedRef.current = true;
      cleanupPolling();
      processCameraFiles(files);
      isProcessingCameraRef.current = false;

      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    },
    [processCameraFiles, cleanupPolling],
  );

  const startFilePolling = useCallback(() => {
    cleanupPolling();

    let pollCount = 0;
    const maxPolls = 60;

    pollingIntervalRef.current = setInterval(() => {
      pollCount++;

      if (cameraInputRef.current && cameraInputRef.current.files && cameraInputRef.current.files.length > 0) {
        handleCameraFilesReady(cameraInputRef.current.files);
        return;
      }

      if (pollCount >= maxPolls) {
        cleanupPolling();
        isProcessingCameraRef.current = false;
        cameraFilesProcessedRef.current = false;
      }
    }, 500);
  }, [handleCameraFilesReady, cleanupPolling]);

  const startCameraStream = useCallback(async (facing: 'environment' | 'user' = 'environment') => {
    setCameraError(null);

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setFacingMode(facing);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const name = err && typeof err === 'object' && 'name' in err ? String((err as { name?: string }).name) : '';
      if (name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (name === 'NotReadableError') {
        setCameraError('Camera is in use by another application.');
      } else {
        setCameraError('Failed to access camera. Please try again.');
      }
    }
  }, []);

  const capturePhotoFromStream = useCallback(() => {
    if (!videoRef.current || !mediaStreamRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setCapturedPhotos((prev) => [...prev, file]);
        }
      },
      'image/jpeg',
      0.9,
    );
  }, []);

  const switchCamera = useCallback(() => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    void startCameraStream(newFacing);
  }, [facingMode, startCameraStream]);

  const openCameraModal = useCallback(() => {
    setCapturedPhotos([]);
    setCameraError(null);
    setShowCameraModal(true);
    setTimeout(() => {
      void startCameraStream('environment');
    }, 100);
  }, [startCameraStream]);

  const closeCameraModal = useCallback(
    (savePhotos = false) => {
      stopCameraStreamInner();

      if (savePhotos && capturedPhotos.length > 0) {
        setSelectedFiles((prevFiles) => {
          const existingFiles = prevFiles ? Array.from(prevFiles) : [];
          const allFiles = [...existingFiles, ...capturedPhotos];

          const dataTransfer = new DataTransfer();
          allFiles.forEach((file) => dataTransfer.items.add(file));
          const combinedFileList = dataTransfer.files;

          setValue('photos', combinedFileList);
          void trigger('photos');

          return combinedFileList;
        });
      }

      setCapturedPhotos([]);
      setShowCameraModal(false);
      setCameraError(null);
    },
    [capturedPhotos, setValue, trigger, stopCameraStreamInner],
  );

  const removeCapturedPhoto = useCallback((index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    if (!showCameraModal) {
      stopCameraStreamInner();
    }
  }, [showCameraModal, stopCameraStreamInner]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && cameraInputRef.current && isProcessingCameraRef.current) {
        const checkIntervals = [100, 300, 500, 1000, 2000];
        checkIntervals.forEach((delay) => {
          setTimeout(() => {
            if (cameraInputRef.current && cameraInputRef.current.files && cameraInputRef.current.files.length > 0) {
              handleCameraFilesReady(cameraInputRef.current.files);
            }
          }, delay);
        });
      }
    };

    const handlePageShow = () => {
      if (isProcessingCameraRef.current && cameraInputRef.current) {
        setTimeout(() => {
          if (cameraInputRef.current && cameraInputRef.current.files && cameraInputRef.current.files.length > 0) {
            handleCameraFilesReady(cameraInputRef.current.files);
          }
        }, 300);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      cleanupPolling();
    };
  }, [handleCameraFilesReady, cleanupPolling]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessingCameraRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    return () => {
      cleanupPolling();
      stopCameraStreamInner();
      if (cameraInputRef.current && cameraInputRef.current.parentNode) {
        try {
          cameraInputRef.current.parentNode.removeChild(cameraInputRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [cleanupPolling, stopCameraStreamInner]);

  const vatRegistered = watch('vatRegistered');

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 md:space-y-8">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
            <div className="text-center font-avenir-regular text-xs text-red-800 sm:text-sm">{submitError}</div>
          </div>
        )}

        <section className="space-y-4 border-b border-[#E5E7EB] pb-6 md:pb-8">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <BookingHubInputField
                id="propertyName"
                label="Property Name"
                required
                size="md"
                placeholder="e.g. City Centre Apartment"
                error={errors.propertyName?.message}
                {...register('propertyName')}
              />
            </div>
            <div>
              <BookingHubSelectField
                id="propertyType"
                label="Property Type"
                required
                size="md"
                placeholder="Select type"
                value={watch('propertyType') || ''}
                onValueChange={(value) => {
                  setValue('propertyType', value as PropertyForm['propertyType']);
                  void trigger('propertyType');
                }}
                options={MANUAL_PROPERTY_TYPE_OPTIONS}
                error={errors.propertyType?.message}
                name="propertyType"
              />
            </div>
          </div>

          <div className="w-full">
            <BookingHubInputField
              id="houseAddress"
              label="Address"
              required
              size="md"
              placeholder="Start typing to search..."
              helperText="Google Places autocomplete"
              error={errors.houseAddress?.message}
              {...register('houseAddress')}
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <BookingHubInputField
                id="bedrooms"
                label="Number of Bedrooms"
                required
                size="md"
                type="number"
                min={1}
                placeholder="1"
                error={errors.bedrooms?.message}
                {...register('bedrooms', { valueAsNumber: true })}
              />
            </div>
            <div>
              <BookingHubInputField
                id="beds"
                label="Number of Beds"
                required
                size="md"
                type="number"
                min={1}
                placeholder="2"
                error={errors.beds?.message}
                {...register('beds', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="w-full">
            <BookingHubInputField
              id="maxOccupancy"
              label="Maximum Occupancy"
              required
              size="md"
              type="number"
              min={1}
              placeholder="4"
              error={errors.maxOccupancy?.message}
              {...register('maxOccupancy', { valueAsNumber: true })}
            />
          </div>

          <div className="w-full">
            <BookingHubInputField
              id="nightlyRate"
              label="All-inclusive Nightly Rate (£)"
              required
              size="md"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="85"
              error={errors.nightlyRate?.message}
              {...register('nightlyRate', { valueAsNumber: true })}
            />
          </div>
        </section>

        <section className="space-y-4 border-b border-[#E5E7EB] pb-6 md:pb-8">
          <div className="w-full">
            <BookingHubSelectField
              id="parkingType"
              label="Parking Type"
              size="md"
              placeholder="Select parking type"
              value={watch('parkingType') || ''}
              onValueChange={(value) => {
                setValue('parkingType', value === '' ? undefined : (value as PropertyForm['parkingType']));
                void trigger('parkingType');
              }}
              options={MANUAL_PARKING_OPTIONS}
              error={errors.parkingType?.message}
              name="parkingType"
            />
          </div>
        </section>

        <section className="space-y-4 border-b border-[#E5E7EB] pb-6 md:pb-8">
          <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Amenities</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'workspaceDesk', label: 'Workspace / Desk' },
              { key: 'highSpeedWifi', label: 'High-Speed Wi-Fi' },
              { key: 'smartTv', label: 'Smart TV(s)' },
              { key: 'livingDiningSpace', label: 'Living / Dining Space' },
              { key: 'washingMachine', label: 'Washing Machine' },
              { key: 'fullyEquippedKitchen', label: 'Fully Equipped Kitchen' },
              { key: 'ironIroningBoard', label: 'Iron & Ironing Board' },
              { key: 'linenTowelsProvided', label: 'Linen & Towels Provided' },
              { key: 'consumablesProvided', label: 'Consumables Provided' },
            ].map(({ key, label }) => (
              <label
                key={key}
                htmlFor={key}
                className="flex cursor-pointer items-center gap-3 font-avenir-regular text-sm font-medium text-[#0B1D37]"
              >
                <input id={key} {...register(key as keyof PropertyForm)} type="checkbox" className="peer sr-only" />
                <span
                  className="flex size-5 shrink-0 rounded-full border-2 border-[#D5D7DA] bg-white transition-colors peer-checked:border-[#00BAB5] peer-checked:bg-[#00BAB5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00BAB5] peer-focus-visible:ring-offset-2"
                  aria-hidden
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-b border-[#E5E7EB] pb-6 md:pb-8">
          <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Safety &amp; Compliance</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'smokeAlarm', label: 'Smoke Alarm' },
              { key: 'coAlarm', label: 'CO Alarm' },
              { key: 'fireExtinguisherBlanket', label: 'Fire Risk Assessment' },
              { key: 'epc', label: 'EPC' },
              { key: 'gasSafetyCertificate', label: 'Gas Safety Certificate' },
              { key: 'eicr', label: 'EICR' },
            ].map(({ key, label }) => (
              <label
                key={key}
                htmlFor={`safety-${key}`}
                className="flex cursor-pointer items-center gap-3 font-avenir-regular text-sm font-medium text-[#0B1D37]"
              >
                <input
                  id={`safety-${key}`}
                  {...register(key as keyof PropertyForm)}
                  type="checkbox"
                  className="peer sr-only"
                />
                <span
                  className="flex size-5 shrink-0 rounded-full border-2 border-[#D5D7DA] bg-white transition-colors peer-checked:border-[#00BAB5] peer-checked:bg-[#00BAB5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00BAB5] peer-focus-visible:ring-offset-2"
                  aria-hidden
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-b border-[#E5E7EB] pb-6 md:pb-8">
          <div>
            <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">Photos</h2>
            <p className="bh-body mt-1 font-avenir font-medium tracking-wide text-booking-gray">
              Minimum 5 photos required (kitchen, living space, bedrooms, bathrooms, or other key areas). First photo is
              used as the hero image.
            </p>
          </div>

          <input type="file" accept="image/*" id="photos" multiple onChange={handleFileChange} className="hidden" />

          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#D5D7DA] bg-[#FAFAFA] px-4 py-10 sm:py-12">
            <ImageIcon className="size-10 text-[#A4A7AE]" strokeWidth={1.25} aria-hidden />
            <p className="text-center font-avenir-regular text-sm text-[#535862]">
              Upload photos (minimum 5 required). First photo = hero image.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <BookingHubSecondaryButton
                type="button"
                size="md"
                iconLeading={<Upload className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
                onClick={() => {
                  const fileInput = document.getElementById('photos') as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                Upload Photos
              </BookingHubSecondaryButton>
              <BookingHubSecondaryButton type="button" size="md" disabled={showCameraModal} onClick={openCameraModal}>
                Take photos
              </BookingHubSecondaryButton>
            </div>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-booking-dark font-avenir tracking-wide">
                  Selected Photos ({selectedFiles.length})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles(null);
                    setValue('photos', null as unknown as FileList);
                    void trigger('photos');
                  }}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors font-avenir tracking-wide"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={`${file.name}-${index}`} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = Array.from(selectedFiles);
                        newFiles.splice(index, 1);
                        const newFileList = new DataTransfer();
                        newFiles.forEach((f) => newFileList.items.add(f));
                        const updatedFiles = newFileList.files;
                        setSelectedFiles(updatedFiles);
                        setValue('photos', updatedFiles);
                        void trigger('photos');
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity duration-200 hover:bg-red-600 group-hover:opacity-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.photos && (
            <p className="mt-2 text-sm text-red-600">{String(errors.photos.message || 'Invalid photos')}</p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="bh-label text-booking-dark uppercase tracking-wide font-semibold">VAT details</h2>
          <p className="bh-body font-avenir font-medium tracking-wide text-booking-gray">
            VAT details apply to this property only.
          </p>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="font-avenir-regular text-sm font-medium text-[#0B1D37]">VAT Registered</span>
            <button
              type="button"
              role="switch"
              aria-checked={vatRegistered}
              onClick={() => {
                const next = !vatRegistered;
                setValue('vatRegistered', next);
                if (!next) {
                  setValue('vatDetails', '');
                  setValue('vatProvideInvoiceAgreement', false);
                }
                void trigger(['vatRegistered', 'vatDetails', 'vatProvideInvoiceAgreement']);
              }}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66B2B2] focus-visible:ring-offset-2',
                vatRegistered ? 'bg-[#66B2B2]' : 'bg-[#E5E7EB]',
              )}
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform',
                  vatRegistered && 'translate-x-5',
                )}
                aria-hidden
              />
            </button>
          </div>

          {vatRegistered ? (
            <div className="space-y-4 border-t border-[#E5E7EB] pt-4">
              <BookingHubInputField
                id="vatDetails"
                label="VAT Registration Number"
                required
                size="md"
                placeholder="e.g. GB123456789"
                error={errors.vatDetails?.message}
                {...register('vatDetails')}
              />
              <div>
                <label
                  htmlFor="vatProvideInvoiceAgreement"
                  className="flex cursor-pointer items-start gap-3 font-avenir-regular text-sm font-medium text-[#0B1D37]"
                >
                  <input
                    id="vatProvideInvoiceAgreement"
                    type="checkbox"
                    className="peer sr-only"
                    {...register('vatProvideInvoiceAgreement')}
                  />
                  <span
                    className="mt-0.5 flex size-5 shrink-0 rounded-full border-2 border-[#D5D7DA] bg-white transition-colors peer-checked:border-[#00BAB5] peer-checked:bg-[#00BAB5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00BAB5] peer-focus-visible:ring-offset-2"
                    aria-hidden
                  />
                  <span>I agree to provide a VAT invoice to the client upon request</span>
                </label>
                {errors.vatProvideInvoiceAgreement?.message ? (
                  <p className="mt-2 text-sm text-red-600">{errors.vatProvideInvoiceAgreement.message}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <div className="relative z-10 flex w-full flex-col items-center border-t border-[#E5E7EB] pt-6 md:pt-8">
          <div className={BH_ADD_PROPERTY_NAV_MAX_W}>
            <BookingHubPrimaryButton
              type="submit"
              fullWidth
              responsive
              loading={loading}
              loadingText={loadingSubmitLabel}
              iconTrailing={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />}
            >
              {submitLabel}
            </BookingHubPrimaryButton>
          </div>
        </div>
      </form>

      {showCameraModal && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black">
          <div className="flex items-center justify-between bg-black/80 p-4">
            <h3 className="text-lg font-semibold text-white">Take Photos</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={switchCamera}
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                title="Switch Camera"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => closeCameraModal(false)}
                className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
            {cameraError ? (
              <div className="p-6 text-center">
                <div className="mb-4 text-red-400">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="mb-4 text-lg text-white">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => void startCameraStream(facingMode)}
                  className="rounded-lg bg-booking-teal px-6 py-2 text-white transition-colors hover:bg-opacity-90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
            )}
          </div>

          {capturedPhotos.length > 0 && (
            <div className="bg-black/80 p-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {capturedPhotos.map((photo, index) => (
                  <div key={`cap-${index}`} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Captured ${index + 1}`}
                      className="h-16 w-16 rounded-lg border-2 border-white/50 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeCapturedPhoto(index)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-center text-sm text-white/70">
                {capturedPhotos.length} photo{capturedPhotos.length !== 1 ? 's' : ''} captured
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-8 bg-black/80 p-6">
            <button
              type="button"
              onClick={() => closeCameraModal(false)}
              className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={capturePhotoFromStream}
              disabled={!!cameraError}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              title="Capture Photo"
            >
              <div className="h-16 w-16 rounded-full border-4 border-booking-teal" />
            </button>

            <button
              type="button"
              onClick={() => closeCameraModal(true)}
              disabled={capturedPhotos.length === 0}
              className={`rounded-lg bg-booking-teal px-6 py-3 font-medium text-white transition-colors ${
                capturedPhotos.length === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-90'
              }`}
            >
              Done ({capturedPhotos.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export const PropertyManualListingForm = forwardRef(PropertyManualListingFormInner);
PropertyManualListingForm.displayName = 'PropertyManualListingForm';
