import { supabase } from '@/lib/supabase';

/**
 * Uploads photos and inserts a partner property row (same behaviour as legacy partner dashboard).
 */
export async function partnerSubmitNewProperty(
  landlordId: string | undefined,
  propertyData: Record<string, unknown> & { photos?: FileList | null },
): Promise<Record<string, unknown>> {
  if (!landlordId) {
    throw new Error('Not signed in');
  }

  let photoUrls: string[] = [];

  const photos = propertyData.photos;
  if (photos && typeof (photos as FileList).length === 'number' && (photos as FileList).length > 0) {
    const list = photos as FileList;
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const fileName = `${landlordId}/${Date.now()}-${i}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from('property-photos').upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from('property-photos').getPublicUrl(fileName);
        photoUrls.push(publicUrl);
      }
    }
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      landlord_id: landlordId,
      property_name: propertyData.propertyName,
      house_address: propertyData.houseAddress,
      locality: propertyData.locality || null,
      city: propertyData.city,
      county: propertyData.county,
      country: propertyData.country,
      postcode: propertyData.postcode,
      property_type: propertyData.propertyType,
      bedrooms: propertyData.bedrooms,
      beds: propertyData.beds,
      beds_breakdown: propertyData.bedsBreakdown || null,
      bathrooms: propertyData.bathrooms,
      max_occupancy: propertyData.maxOccupancy,
      parking_type: propertyData.parkingType || null,
      photos: photoUrls,
      workspace_desk: propertyData.workspaceDesk,
      high_speed_wifi: propertyData.highSpeedWifi,
      smart_tv: propertyData.smartTv,
      fully_equipped_kitchen: propertyData.fullyEquippedKitchen,
      living_dining_space: propertyData.livingDiningSpace,
      washing_machine: propertyData.washingMachine,
      iron_ironing_board: propertyData.ironIroningBoard,
      linen_towels_provided: propertyData.linenTowelsProvided,
      consumables_provided: propertyData.consumablesProvided,
      smoke_alarm: propertyData.smokeAlarm,
      co_alarm: propertyData.coAlarm,
      fire_extinguisher_blanket: propertyData.fireExtinguisherBlanket,
      epc: propertyData.epc,
      gas_safety_certificate: propertyData.gasSafetyCertificate,
      eicr: propertyData.eicr,
      additional_info: propertyData.additionalInfo || null,
      vat_details: (() => {
        const parts: string[] = [];
        const vatReg = (propertyData as { vatRegistered?: boolean }).vatRegistered;
        if (typeof vatReg === 'boolean') {
          parts.push(`VAT registered: ${vatReg ? 'Yes' : 'No'}`);
        }
        const detail = String(propertyData.vatDetails || '').trim();
        if (detail) parts.push(detail);
        const invoiceAgreement = Boolean((propertyData as { vatProvideInvoiceAgreement?: boolean }).vatProvideInvoiceAgreement);
        if (vatReg && invoiceAgreement) {
          parts.push('Agreed to provide VAT invoice to client on request');
        }
        return parts.length ? parts.join('\n') : null;
      })(),
      comments: propertyData.comments || null,
      airbnb: propertyData.airbnb || null,
      payment_method: (propertyData.paymentMethod as { preferredPaymentMethod?: string } | undefined)
        ?.preferredPaymentMethod || null,
      bank_name: (propertyData.paymentMethod as { bankName?: string } | undefined)?.bankName || null,
      account_holder_name:
        (propertyData.paymentMethod as { accountHolderName?: string } | undefined)?.accountHolderName || null,
      sort_code: (propertyData.paymentMethod as { sortCode?: string } | undefined)?.sortCode || null,
      account_number: (propertyData.paymentMethod as { accountNumber?: string } | undefined)?.accountNumber || null,
      weekly_rate: (() => {
        const nightly = Number((propertyData as { nightlyRate?: number }).nightlyRate);
        if (!Number.isFinite(nightly) || nightly <= 0) return null;
        return Math.round(nightly * 7 * 100) / 100;
      })(),
      monthly_rate: null,
      bills_included: false,
      is_available: true,
      activity: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding property:', error);
    throw error;
  }

  return data as Record<string, unknown>;
}
