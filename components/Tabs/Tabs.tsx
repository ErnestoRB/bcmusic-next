import {
  Tabs,
  TabList,
  Tab as TabProps,
  TabPanel,
  TabsProps,
} from "react-aria-components";

interface TabItem {
  key: string;
  display: React.ReactNode;
  content: React.ReactNode;
}

interface TabProps extends TabsProps {
  title: string;
  tabs: TabItem[];
  listClass?: string;
  itemClass?: string;
}

export function TabComponent({
  title,
  tabs,
  orientation,
  listClass = "",
  itemClass = "",
  className,
}: TabProps) {
  return (
    <Tabs orientation={orientation} className={className}>
      <TabList className={listClass} aria-label={title}>
        {tabs.map(({ key, display }) => {
          return (
            <TabProps className={itemClass} key={key} id={key}>
              {display}
            </TabProps>
          );
        })}
      </TabList>
      {tabs.map(({ key, content }) => {
        return (
          <TabPanel key={key} id={key}>
            {content}
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
