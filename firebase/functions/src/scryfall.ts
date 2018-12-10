import axios from 'axios';
import * as createError from 'http-errors';

/**
 * Return the cannonical set code for the provided set code.
 * 
 * This method exists because some deck list providers, e.g. MTGGoldfish,
 * do not use the proper set code name. For example, in their deck lists,
 * they use the set code MM instead of MMQ for "Mercadian Masques". The
 * exact set code must be used when provided to Scryfall.
 * 
 * @param set The (potentially non-cannonical) set code, e.g. PUMA
 */
const getCannonicalSetCode = function(set: string): string {
    if (set.toLowerCase() === "mm") {
        return "MMQ";
    }
    return set;
}

/**
 * Describes the arguments that are used when looking up a card.
 */
export interface CardParams {
    /**
     * The name of the card.
     */
    exact: string,

    /**
     * Optional. The set code of the preferred set. Note that if the card does
     * not exist in the provided set, no data will be returned.
     */
    set?: string
}

/**
 * Get card data for the card described by the CardParams.
 * 
 * @param params The parameters describing the target card
 */
export async function getCardData(params: CardParams): Promise<any> {
    try {
        // http GET https://api.scryfall.com/cards/named exact=='Demonic Tutor' set==PUMA
        const response = await axios.get('https://api.scryfall.com/cards/named', {
            params: {
                exact: params.exact,
                ...params.set && { set: getCannonicalSetCode(params.set) }
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to get card', params);
            throw createError(500);
        }
    } catch (e) {
        if (e instanceof createError.HttpError) {
            throw e;
        } else {
            console.error('Network request to scryfall failed', e)
            throw createError(500);
        }
    }
}