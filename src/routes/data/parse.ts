import { getMap_smart } from '../utils'
import type { InitialData } from './types/initial-data'
import type { PlayerResponse } from './types/player-response'

export async function TryGetYouTubePage(url: s) {
	const html = await fetch(url).then(res => res.text())

	return {
		initialData: parse<InitialData>(
			html
				.split('var ytInitialData =')[1]
				?.split('</script>')[0]
				.slice(0, -1)
		),
		playerResponse: parse<PlayerResponse>(
			html
				.split('var ytInitialPlayerResponse =')[1]
				?.split('</script>')[0]
				.slice(0, -1)
		),
		apiToken: html
			.split('innertubeApiKey')[1]
			?.trim()
			.split(',')[0]
			.split('"')[2],
		context: parse(
			html.split('INNERTUBE_CONTEXT')[1]?.trim().slice(2, -2) ?? '{}'
		),
	}
}
function parse<T>(object?: s) {
	return JSON.parse(object ?? '{}') as T
}

type page = ReturnType<typeof TryGetYouTubePage>
const map = new Map<string, page>()

export const getYouTubePage = async (url: s) =>
	await getMap_smart(url, map, TryGetYouTubePage, url)

export type Page = Awaited<page>