# Reaper– a nodejs crawler extractor framework



# Introduction

A crawler extractor follows this sequence of steps

- --Fetch a url
- --Select some items (such as menu items) via xpath selectors
- --Select submenus
- --Click on submenus
- --Load resultant page
- --Page through search results
  - In each page
    - Select elements
    - Click on that
    - Go to resulting page
    - Extract elements

Some information may be captured in each action of the engine and stored in **state**. The output of the system will be stored in a Results object that is populated by **Extractors**.

# Design

This consists of one engine,  multiple utility classes, and a hierarchical json configuration to wire everything up.

# The instructions file

The instructions file is designed to mimic the actions that a human user would perform if (theoretically) she were to navigate the site manually.

The steps that a user would follow are mentioned above. This structure seems to be hierarchichal – first go to a site, then perform sequence of clicks/hovers etc to reach a particular page, then extract items from that page.

Some common patterns

- --Multiple items of same type (links typically) are followed
- --Multiple pages of search results with paginator are followed

Instructions are a json object, consisting of an array of instructions. Each instruction is passed a context by the engine. The action corresponding to the instruction can store objects that need to be destroyed in the context.

Each context lives within the scope of the instruction. If an instruction has &quot;andThen&quot; elements inside it, then the scope of the instruction is not changed, and the context is destroyed only after all the instruction within the &quot;andThen&quot; elements are completed.

Each instruction node would have

- --A selector to decide which elements need to be selected for that action
- --A action function to perform the action(s)
- --A config JSON object to provide parameters to the action
  - A handler to perform some action in addition to the given one
- --Optionally, an &quot;andThen&quot; element that consists of one or more instructions that need to be executed within the context of the instruction. Components

## Illustrative flow

Consider the following extraction flow

{
     **&quot;instructions&quot;** : [
      {
         **&quot;selector&quot;** : **&quot;none&quot;** ,
         **&quot;action&quot;** : **&quot;Fetcher&quot;** ,
         **&quot;name&quot;** : **&quot;FirstFetcher&quot;** ,
         **&quot;params&quot;** : {
           **&quot;url&quot;** : **&quot;http://www.schoolbooks.ie&quot;
        ** }
      },
      {
         **&quot;action&quot;** : **&quot;Selector&quot;** ,
         **&quot;name&quot;** : **&quot;selectMenuItems&quot;** ,
         **&quot;params&quot;** : {
           **&quot;selector&quot;** : **&quot;/html/body/div[6]/div[3]/div/div[1]/ul/li&quot;
        ** },
         **&quot;andThen&quot;** :[
          {
             **&quot;action&quot;** : **&quot;Extractor&quot;** ,
             **&quot;name&quot;** : **&quot;extractLevel&quot;** ,
             **&quot;cleanser&quot;** : **&quot;cleanLevel&quot;** ,
             **&quot;addResultNode&quot;** : **true** ,
             **&quot;params&quot;** : {
               **&quot;fieldName&quot;** : **&quot;schoolLevel&quot;** ,
               **&quot;selector&quot;** : **&quot;a&quot;** ,
               **&quot;relative&quot;** : **true
            ** }

          }
        ]

      }
    ]
}

The crawler starts, and executes the first instruction, a Fetcher which fetches the url [http://www.schoolbooks.ie](http://www.schoolbooks.ie). When a page is fetched, it is stored in the context, and is closed after the scope of the instruction is over.

After fetch is complete, crawler executes a Selector which will select all the menu items of the page. For each of the items, the &quot;andThen&quot; option is executed. Note that whenever an instruction has to be executed for each element of a set of results of one instruction, the &quot;andThen&quot; element needs to be specified.

In this case, for each of the elements that are selected, the Extractor is executed. The extractor takes the content of the &quot;a&quot; element and store it in the result. Because the &quot;addResultNode&quot; is set to true, each element is stored in a separate node.

# Config file options

Sample config file is given below

**exports**. **config** = {
     **headless** : **true** ,
     **testMode** : **true** ,
     **reaperFile** : **&quot;test.json&quot;** ,
     **resultsFile** : **&quot;./results.json&quot;** ,
     **numberOfRecordsToSaveAfter** :25,
     **logFileName** : **&quot;reaper.log&quot;** ,
     **logLevel** : **&quot;info&quot;** ,
     **saveAsCSV** : **true** ,
     **csvFileName** : **&quot;./results.csv&quot;** ,
     **recordHandlerDirName** : **&quot;recordHandlers&quot;** ,
     **cleansersDirName** : **&quot;cleansers&quot;**
}

### headless – to specify whether chrome ui is to be displayed or not

testMode – when set to true, only one element is returned by a selector or page iterator

reaperFile – the instructions file

resultsFile – the file in which results are stored. This is in json format

numberOfRecordsToSaveAfter – for periodic saving of records

logFileName – name of log file name

logLevel – check Winston logging package for log levels

saveAsCSV – whether a csv file is required

csvFileName - name of csvFile
cleansersDirName - cleansers to be executed after every extractor action. Cleansers can be specified in instruction file.
recordHandlerDirName – where user supplied recordhandler files are present. A test recordhandler and test cleanser is supplied along with the package

## Selector Format

Selectors use the xpath format. In google chrome, Xpath selector of any element can be obtained by opening a web page, right clicking on an element and choosing &quot;inspect element&quot;. In the inspector, right click on the element an choose copy/copy Xpath selector.

## Engine

The Engine traverses the instructions file and executes action within each instruction in sequence. Some instructions may process multiple DOM nodes.

While processing one DOM node, the action may need to follow a link and reach a page which in turn may contain other DOM nodes.

## Result

The Result object is a place for actions to store the results of the search. This is an internal object and the user of the library need not be aware of this.

Result object is a hierarchichal tree of nodes. When a node needs to be added to the result, the corresponding instruction should have an &quot;addResultNode&quot;: true attribute

The instruction at which point a node is fully populated, should contain a &quot;pop&quot; attribute so that crawler changes context to parent node. When the crawler again descends to process the next element in the list, it will add the next child node.

## State

State object is an internal object; it contains information required for Actions to perform their work.

State should have some structure such that each action can precisely locate the position to store the results of its processing. As traversal happens items should be stacked up on the State contents, when actions get over the stack should also get popped.

## Asynchrony

Currently, the crawler process items sequentially. Subsequent versions may implement asynchrony.

# Actions

Extractor – given field name and html element node, it will extract it from element.

Fetcher – Given url, it will fetch the page from url

ElementIterator – it will iterate over a set of items and perform actions on them

PageIterator – this is to be used in a situation where there are multiple pages of search results. Given the selector which identifies the &quot;next&quot; element of the paginator, it will take a page of results, apply an action to it (probably an ElementIterator), then click on &quot;next&quot; item repeatedly performing this action.

# Actions, Instructions, cleansers, recordHandlers

Actions are classes provided by the Framework. Instructions are json objects which consist of a selector (the target of Action), the action to take (The actual Action), action specific parameters, and also the next instruction to follow.

Cleansers are user defined functions which are triggered after after every extractor action. They can be specified in the instruction. They are sent the results of extraction, and can change the results.

Recordhandlers are executed if &quot;saveAsCSV&quot; is specified in the configuration file. The tree is flattened, and the record handlers are executed in no particular order on all rows of the resulting array.

Actions are part of the framework, and there is no facility to plugin actions at this point of time. Cleansers and recordHandlers are to be defined by the user of the library and the path supplied in the config file. These will be injected into actions.

# Target of actions

Actions perform actions. The target of the actions may vary.

For **Fetcher** , the target would be the url taken from parameters object.

For **Selector** , the object on which the action happens would be the &quot;currentElement&quot;. The notion of currentElement would be the element passed by parent instruction.

For Extractor, the selector parameter would be applied to current object and the innerHTML of the resulting object collected.