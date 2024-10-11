import FeaturedProducts from '@/components/Home/FeaturedProducts';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Disc3, Headphones, Speaker } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
	return (
		<>
			<section className='w-full py-12 md:py-24 lg:py-32 xl:py-44'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h1 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl'>
								Learn, Practice and Rent Gear
							</h1>
							<p className='mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400 tracking-tight leading-tight'>
								Everything you need for your music journey in one place.
							</p>
						</div>
						<div className='space-x-4'>
							<Button asChild>
								<Link href={'/auth/signup'}>Get Started</Link>
							</Button>
							<Button variant='outline' asChild>
								<Link href={'#about'}>Learn More</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
			<section
				id='about'
				className='w-full py-12 md:py-24 lg:py-24 bg-gradient-to-r rounded-md from-primary/10 to-secondary/10'>
				<div className='container px-4 md:px-6'>
					<h2 className='text-xl font-bold tracking-tighter sm:text-3xl text-center mb-8'>
						Our Courses
					</h2>
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{[
							{
								title: 'DJ Courses',
								description: 'From beginner to advanced dj-ing',
								icon: Disc3,
							},
							{
								title: 'Audio Engineering',
								description: 'Learn how to mix and master your songs',
								icon: Speaker,
							},
							{
								title: 'Music Production',
								description: 'Create and mix your own tracks',
								icon: Headphones,
							},
						].map((course, index) => (
							<Card key={index}>
								<CardHeader>
									<course.icon className='w-8 h-8 mb-2' />
									<CardTitle>{course.title}</CardTitle>
									<CardDescription>{course.description}</CardDescription>
								</CardHeader>
								<CardFooter>
									<Button asChild>
										<Link href={'/courses'}>Apply Now</Link>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>
			<section className='w-full py-12 md:py-24 lg:py-32'>
				<div className='container px-4 md:px-6'>
					<div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
						<div className='flex flex-col justify-center space-y-4'>
							<h2 className='text-xl font-bold tracking-tighter sm:text-3xl'>
								Book Studio Time
							</h2>
							<p className='max-w-[600px] text-gray-500 text-sm dark:text-gray-400'>
								Access state-of-the-art recording facilities. Perfect your sound
								in our professional studios.
							</p>
							<div className='flex flex-col gap-2 min-[400px]:flex-row'>
								<Button asChild>
									<Link href={'/studio'}>
										<Speaker className='mr-2 h-4 w-4' />
										Book Now
									</Link>
								</Button>
							</div>
						</div>
						<div className='flex flex-col justify-center space-y-4'>
							<h2 className='text-xl font-bold tracking-tighter sm:text-3xl'>
								Rent Music Gear
							</h2>
							<p className='max-w-[600px] text-gray-500 text-sm dark:text-gray-400'>
								Try before you buy. Rent top-quality instruments and equipment
								for your next gig or recording session.
							</p>
							<div className='flex flex-col gap-2 min-[400px]:flex-row'>
								<Button asChild>
									<Link href={'/gear'}>
										<Disc3 className='mr-2 h-4 w-4' />
										Rent Gear
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
			<FeaturedProducts />
		</>
	);
}
