import Taro, {useCallback, usePullDownRefresh, useRouter, useState} from '@tarojs/taro'
import {Block, View, Text} from '@tarojs/components'
import {observer} from '@tarojs/mobx';
import dayjs from "dayjs";
import useComic from "@/hooks/use-comic";
import MangaHeader from "@/components/manga-header";

import './manga.scss'

const Manga: Taro.FC = () => {
  const [timestamp, setTimeStamp] = useState(() => dayjs().unix())
  const {params: {oid}} = useRouter()

  const {data, refetch} = useComic(() => oid, [oid])
  const handleRefresh = useCallback(async () => {
    setTimeStamp(() => dayjs().unix())
    await refetch()
    Taro.stopPullDownRefresh()
  }, [refetch])

  usePullDownRefresh(handleRefresh)
  const filter = data || {
    id: parseInt(oid),
    authors: [],
    types: [],
    status: [],
    chapters: [{data: [{chapter_id: -1}]}]
  }
  const firstChapter = (filter.chapters[0].data.pop() as any).chapter_id
  return (
    <Block>
      <View className='mg-primary'>
        <MangaHeader {...filter} firstChapter={firstChapter} timestamp={timestamp} />
        <View className='mg-primary-container'>
          <View className='at-card__header'>
            <View className='at-card__header-thumb'>
              <View className='taro-img at-card__header-thumb-info'>
                <View className='taro-img__mode-scaletofill at-icon at-icon-bookmark' />
              </View>
            </View>
            <Text className='taro-text at-card__header-title'>这是个标题</Text>
            <Text className='taro-text at-card__header-extra'>额外信息</Text>
          </View>
        </View>
      </View>
    </Block>
  )
}
Manga.config = {
  enablePullDownRefresh: true
}

export default observer(Manga)
