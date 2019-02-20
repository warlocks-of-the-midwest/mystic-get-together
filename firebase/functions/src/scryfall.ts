import axios from 'axios';
import * as Response from './response';

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
            throw new Response.FunctionError(
                Response.Messages.SCRYFALL_ERROR,
                Response.Errors.SCRYFALL_ERROR,
            );
        }
    } catch (e) {
        if (e instanceof Response.FunctionError) {
            throw e;
        } else {
            console.error('Network request to scryfall failed', e)
            throw new Response.FunctionError(
                Response.Messages.SCRYFALL_ERROR,
                Response.Errors.SCRYFALL_ERROR,
            );
        }
    }
}

/**
 * Get card data for the card with the given ID.
 * 
 * @param id The id of the card
 */
export async function getCardDataForID(id: string): Promise<any> {
    try {
        // http GET https://api.scryfall.com/cards/3bdbc231-5316-4abd-9d8d-d87cff2c9847
        const response = await axios.get('https://api.scryfall.com/cards/' + id);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to get card', id);
            throw new Response.FunctionError(
                Response.Messages.SCRYFALL_ERROR,
                Response.Errors.SCRYFALL_ERROR,
            );
        }
    } catch (e) {
        if (e instanceof Response.FunctionError) {
            throw e;
        } else {
            console.error('Network request to scryfall failed', e)
            throw new Response.FunctionError(
                Response.Messages.SCRYFALL_ERROR,
                Response.Errors.SCRYFALL_ERROR,
            );
        }
    }
}
