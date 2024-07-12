import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Home() {
  return (
    <main className="flex flex-col w-fit items-start space-y-4 p-4">
      <Button variant="default" size="sm">Hello</Button>
      <Button variant="outline" size="sm">Hello</Button>
      <Button variant="ghost" size="sm">Hello</Button>
      <Button variant="link" size="sm">Hello</Button>
      <Button variant="default">Hello</Button>
      <Button variant="outline">Hello</Button>
      <Button variant="ghost">Hello</Button>
      <Button variant="link">Hello</Button>
      <Button variant="default" size="lg">Hello</Button>
      <Button variant="outline" size="lg">Hello</Button>
      <Button variant="ghost" size="lg">Hello</Button>
      <Button variant="link" size="lg">Hello</Button>
      <Button variant="default" size="xl">Hello</Button>
      <Button variant="outline" size="xl">Hello</Button>
      <Button variant="ghost" size="xl">Hello</Button>
      <Button variant="link" size="xl">Hello</Button>
      <Badge variant="default">Hello</Badge>
      <Badge variant="outline">Hello</Badge>
      <Input placeholder="Hello" />
    </main>
  );
}
