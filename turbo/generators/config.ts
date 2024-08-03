import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

interface PackageJson {
	name: string;
	scripts: Record<string, string>;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator("gen", {
		description: "Generate a crud generator",
		prompts: [
			{
				type: "input",
				name: "name",
				message:
					"What is the name of the crud?",
			},
		],
		actions: [
			(answers) => {
				if ("name" in answers && typeof answers.name === "string") {
					if (answers.name.startsWith("@web-kit/")) {
						answers.name = answers.name.replace("@web-kit/", "");
					}
				}
				return "Config sanitized";
			},
			{
				type: "add",
				path: "packages/{{ name }}/package.json",
				templateFile: "templates/package/package.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/tsconfig.json",
				templateFile: "templates/package/tsconfig.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/index.ts",
				template: "export * from './src';",
			},
			{
				type: "add",
				path: "packages/{{ name }}/src/index.ts",
				template: "export const name = '{{ name }}';",
			},
			{
				type: "modify",
				path: "packages/{{ name }}/package.json",
				async transform(content, answers) {
					if ("deps" in answers && typeof answers.deps === "string") {
						const pkg = JSON.parse(content) as PackageJson;
						for (const dep of answers.deps.split(" ").filter(Boolean)) {
							const version = await fetch(
								`https://registry.npmjs.org/-/package/${dep}/dist-tags`,
							)
								.then((res) => res.json())
								.then((json) => json.latest);
							if (!pkg.dependencies) pkg.dependencies = {};
							pkg.dependencies[dep] = `^${version}`;
						}
						return JSON.stringify(pkg, null, 2);
					}
					return content;
				},
			},
			async (answers) => {
				/**
				 * Install deps and format everything
				 */
				if ("name" in answers && typeof answers.name === "string") {
					execSync("bun i", { stdio: "inherit" });
					execSync(
						`bun @biomejs/biome format --write packages/${answers.name}/**`,
					);
					return "Package formated";
				}
				return "Package not formated";
			},
		],
	});
}
