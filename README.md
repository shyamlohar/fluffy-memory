# SQL Query testing tool

Walkthrough video: 

[https://www.loom.com/share/5d6a972e563940ca9cf28552f2ebe08e](https://www.loom.com/share/5d6a972e563940ca9cf28552f2ebe08e)

Demo URL: [Demo](https://fluffy-memory-plum.vercel.app/)

## Problem Statement & Design Rationale

### Functional Requirements

- Include space to write query and button to execute said query
- Render the result / failure of queried data
- Cancellation of triggered queries
- Time spent on execution of query
- Save Queries
- Delete Queries
- Rename Queries

### Non Functional Requirements

- Syntax highlighting
- Query validation
- Autocomplete for query
- Responsive UI
- Ability to store query and its result to view previous data offline.
- Ability to transform the queried result to render result data in certain way. e.g base64 values can be rendered as image
- AI support to explain query in natural language and transforming it into SQL query
- Download query result as CSV
- Bookmark Queries / PIN queries
- Directories for saved queries

### **Tech Stack**

- React
- React Router v7
- Tailwind CSS
- Tanstack Virtualize
- Shadcn components (based on Radix UI)

### Initial Design Draft

![image.png](https://raw.githubusercontent.com/shyamlohar/fluffy-memory/refs/heads/main/image.png)

## Design Principles

- **Familiar by default**
    
    UI patterns align with existing data tools to reduce cognitive load.
    
- **Optimized for repeat workflows**
    
    Saved queries, tabs, and shortcuts support users who run the same queries multiple times a day.
    
- **Keyboard-first experience**
    
    Power users can perform most actions without leaving the keyboard.
    
- **State persistence**
    
    Active tabs and queries are preserved across reloads so users can continue where they left off.
    

### **Rationale behind decisions**

I want to keep UI/UX close to other tools that people are comfortable with or already use so they don’t have to learn entirely new thing and then get used to it. 

Tabs would help users quickly move between different queries, rather than having only one active query at a time, there could be a use case like where they want to compare data of two different queries or look at data of two different queries. 

Sidebar for saved queries would help them quickly access the most used queries. some analysts could have use cases where they have to run some queries multiple times a day. having to write these queries every time would be a cumbersome task this would help them save time on it. 

People using this tool extensively would prefer to have keyboard shortcuts for basic things for a good UX and i have kept shortcuts which are intuitive and user can always access these shortcuts using shortcuts floating button to learn about shortcuts and become a power user of a tool. 

Prefill the Query names to improve the UX in case user does not wish to write query name specifically. and if they wish to it should not require manual focus and text changes.

Data Persistance: Preserve the active tabs across reloads / tab closures so user’s can continue from where they had left off.  

Scope  

- Sidebar listing all saved queries
- Tabs to create new Queries
- Tabs to quickly switch between queries
- Save Queries
- Delete Queries
- Run Queries and Cancel running Queries
- Shortcuts for various actions
- Virtualization of queries data
- Search Queries
- Query execution times

Things that i haven’t covered as part of this implementation: 

- Syntax highlighting
- Query validations
- DB explorer
- Query result caching limit
- Usage of different data for different queries
- Pinning Tabs / Queries

**Page load metrics as per** [https://pagespeed.web.dev/](https://pagespeed.web.dev/) **:**

First Contentful Paint: 0.7s

Largest Contentful Paint: 0.7 s

Total Blocking Time: 0 ms

Cumulative Layout Shift: 0 ms 

Test was run on [https://pagespeed.web.dev/](https://pagespeed.web.dev/) to ensure benchmark environment isn’t changing depending on state of machine. 

Optimisations done to improve performance: 

- Lazy load CSV when query is ran instead of loading dummy data at load time
- Virtualizations of table data for improving page performance when there is huge amount of data


### How to run this project locally 

1. Ensure bun runtime is installed 
2. run `bun install`
3. run `bun dev`

