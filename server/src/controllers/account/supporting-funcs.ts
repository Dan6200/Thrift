import BadRequestError from '../../errors/bad-request.js'

/**
 * @description Checks to see if query was successful
 * If the result is empty, throw an error
 * */
export const isSuccessful = async <T>(
  result: Record<string, T>
): Promise<void> => {
  if (result === undefined || Object.keys(result).length === 0)
    throw new BadRequestError(`${result.operation} Operation unsuccessful`)
}
