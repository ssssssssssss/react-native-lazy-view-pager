# react-native-lazy-view-pager

* Android ViewPager and iOS ScrollView {{pageEnable:true}} needs to load all the data in advance which is slow for a large data set. 
* So we'd like to implete a lazy view pager that only loads several siblings of current page, if works in iOS, but  Android version suffers the rendering issue which makes the lazily added view not shown.
