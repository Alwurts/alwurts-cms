import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function Home() {
  return (
    <main className="flex flex-col w-fit items-start space-y-4 p-4">
      <Button variant="default" size="sm">Hello</Button>
      <Button variant="outline" size="sm">Hello</Button>
      <Button variant="default">Hello</Button>
      <Button variant="outline">Hello</Button>
      <Button variant="default" size="lg">Hello</Button>
      <Button variant="outline" size="lg">Hello</Button>
      <Badge variant="default">Hello</Badge>
      <Badge variant="outline">Hello</Badge>
      <Input placeholder="Hello" />
    </main>
  );
}
